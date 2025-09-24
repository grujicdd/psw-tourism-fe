// src/app/feature-modules/tour-authoring/keypoint-management/keypoint-management.component.ts
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { KeyPointService, KeyPoint } from '../keypoint.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-keypoint-management',
  templateUrl: './keypoint-management.component.html',
  styleUrls: ['./keypoint-management.component.css']
})
export class KeyPointManagementComponent implements OnInit, OnChanges {
  @Input() tourId!: number;
  @Input() readOnly: boolean = false;

  keyPoints: KeyPoint[] = [];
  selectedKeyPoint: KeyPoint | null = null;
  showCreateForm = false;
  editingKeyPoint = false;
  temporaryMarker: L.Marker | null = null;

  keyPointForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    latitude: new FormControl<number>(0, [Validators.required]),
    longitude: new FormControl<number>(0, [Validators.required]),
    imageUrl: new FormControl(''),
    order: new FormControl<number>(1, [Validators.required, Validators.min(1)])
  });

  constructor(private keyPointService: KeyPointService) {}

  ngOnInit(): void {
    if (this.tourId) {
      this.loadKeyPoints();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tourId'] && changes['tourId'].currentValue) {
      this.loadKeyPoints();
    }
  }

  loadKeyPoints(): void {
    this.keyPointService.getKeyPointsByTourId(this.tourId).subscribe({
      next: (keyPoints) => {
        this.keyPoints = keyPoints.sort((a, b) => a.order - b.order);
      },
      error: (error) => {
        console.error('Error loading key points:', error);
      }
    });
  }

  onLocationSelected(location: {lat: number, lng: number}): void {
    if (this.readOnly) return;

    this.keyPointForm.patchValue({
      latitude: Number(location.lat.toFixed(6)),
      longitude: Number(location.lng.toFixed(6))
    });

    this.showCreateForm = true;
    this.editingKeyPoint = false;
    this.selectedKeyPoint = null;

    // Set order for new key point
    const nextOrder = this.keyPoints.length > 0 ? Math.max(...this.keyPoints.map(kp => kp.order)) + 1 : 1;
    this.keyPointForm.patchValue({ order: nextOrder });
  }

  onKeyPointSelected(keyPoint: KeyPoint): void {
    if (this.readOnly) return;

    this.selectedKeyPoint = keyPoint;
    this.editingKeyPoint = true;
    this.showCreateForm = true;

    this.keyPointForm.patchValue({
      name: keyPoint.name,
      description: keyPoint.description,
      latitude: keyPoint.latitude,
      longitude: keyPoint.longitude,
      imageUrl: keyPoint.imageUrl,
      order: keyPoint.order
    });
  }

  createKeyPoint(): void {
    if (this.keyPointForm.valid) {
      const formValue = this.keyPointForm.value;
      const keyPoint: KeyPoint = {
        id: 0,
        tourId: this.tourId,
        name: formValue.name || '',
        description: formValue.description || '',
        latitude: formValue.latitude || 0,
        longitude: formValue.longitude || 0,
        imageUrl: formValue.imageUrl || undefined,
        order: formValue.order || 1
      };

      this.keyPointService.createKeyPoint(keyPoint).subscribe({
        next: (createdKeyPoint) => {
          this.keyPoints.push(createdKeyPoint);
          this.keyPoints.sort((a, b) => a.order - b.order);
          this.hideForm();
          console.log('Key point created successfully');
        },
        error: (error) => {
          console.error('Error creating key point:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  updateKeyPoint(): void {
    if (this.keyPointForm.valid && this.selectedKeyPoint) {
      const formValue = this.keyPointForm.value;
      const updatedKeyPoint: KeyPoint = {
        ...this.selectedKeyPoint,
        name: formValue.name || '',
        description: formValue.description || '',
        latitude: formValue.latitude || 0,
        longitude: formValue.longitude || 0,
        imageUrl: formValue.imageUrl || undefined,
        order: formValue.order || 1
      };

      this.keyPointService.updateKeyPoint(updatedKeyPoint).subscribe({
        next: (updated) => {
          const index = this.keyPoints.findIndex(kp => kp.id === updated.id);
          if (index !== -1) {
            this.keyPoints[index] = updated;
            this.keyPoints.sort((a, b) => a.order - b.order);
          }
          this.hideForm();
          console.log('Key point updated successfully');
        },
        error: (error) => {
          console.error('Error updating key point:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  deleteKeyPoint(keyPointId: number): void {
    if (confirm('Are you sure you want to delete this key point?')) {
      this.keyPointService.deleteKeyPoint(keyPointId).subscribe({
        next: () => {
          this.keyPoints = this.keyPoints.filter(kp => kp.id !== keyPointId);
          this.hideForm();
          console.log('Key point deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting key point:', error);
        }
      });
    }
  }

  hideForm(): void {
    this.showCreateForm = false;
    this.editingKeyPoint = false;
    this.selectedKeyPoint = null;
    this.keyPointForm.reset();
    this.removeTempMarker();
  }

  private removeTempMarker(): void {
    if (this.temporaryMarker) {
      this.temporaryMarker = null;
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.keyPointForm.controls).forEach(key => {
      const control = this.keyPointForm.get(key);
      control?.markAsTouched();
    });
  }

  // Validation helpers
  get name() { return this.keyPointForm.get('name'); }
  get description() { return this.keyPointForm.get('description'); }
  get latitude() { return this.keyPointForm.get('latitude'); }
  get longitude() { return this.keyPointForm.get('longitude'); }
  get imageUrl() { return this.keyPointForm.get('imageUrl'); }
  get order() { return this.keyPointForm.get('order'); }

  // Check if tour can be published (needs at least 2 key points)
  get canPublishTour(): boolean {
    return this.keyPoints.length >= 2;
  }
}