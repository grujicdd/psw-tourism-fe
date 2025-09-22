// tour-management.component.ts
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TourService } from '../tour.service';
import { Router } from '@angular/router';
import { Tour, TourState } from '../model/tour.model';

@Component({
  selector: 'xp-tour-management',
  templateUrl: './tour-management.component.html',
  styleUrls: ['./tour-management.component.css']
})
export class TourManagementComponent implements OnInit {

  tours: Tour[] = [];
  showCreateForm = false;
  editingTour: Tour | null = null;

  // Category options (matching the interests from registration)
  categories = [
    { id: 1, name: 'Nature' },
    { id: 2, name: 'Art' },
    { id: 3, name: 'Sport' },
    { id: 4, name: 'Shopping' },
    { id: 5, name: 'Food' }
  ];

  // Difficulty levels
  difficulties = [
    { id: 1, name: 'Easy' },
    { id: 2, name: 'Moderate' },
    { id: 3, name: 'Hard' },
    { id: 4, name: 'Expert' }
  ];

  tourForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    difficulty: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(4)]),
    category: new FormControl(1, [Validators.required]),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    date: new FormControl('', [Validators.required])
  });

  constructor(
    private tourService: TourService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTours();
  }

  loadTours(): void {
    this.tourService.getTours(0, 20).subscribe({
      next: (result) => {
        this.tours = result.results;
      },
      error: (error) => {
        console.error('Error loading tours:', error);
      }
    });
  }

  showCreateTourForm(): void {
    this.showCreateForm = true;
    this.editingTour = null;
    this.tourForm.reset({
      difficulty: 1,
      category: 1,
      price: 0
    });
  }

  hideCreateForm(): void {
    this.showCreateForm = false;
    this.editingTour = null;
    this.tourForm.reset();
  }

  createTour(): void {
    if (this.tourForm.valid) {
      const formValue = this.tourForm.value;
      const tour: Tour = {
        id: 0,
        name: formValue.name || '',
        description: formValue.description || '',
        difficulty: formValue.difficulty || 1,
        category: formValue.category || 1,
        price: formValue.price || 0,
        date: new Date(formValue.date || ''),
        state: TourState.DRAFT
      };

      this.tourService.createTour(tour).subscribe({
        next: (createdTour) => {
          this.tours.push(createdTour);
          this.hideCreateForm();
          console.log('Tour created successfully:', createdTour);
        },
        error: (error) => {
          console.error('Error creating tour:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  editTour(tour: Tour): void {
    this.editingTour = tour;
    this.showCreateForm = true;
    
    // Format date for input[type="datetime-local"]
    const formattedDate = new Date(tour.date).toISOString().slice(0, 16);
    
    this.tourForm.patchValue({
      name: tour.name,
      description: tour.description,
      difficulty: tour.difficulty,
      category: tour.category,
      price: tour.price,
      date: formattedDate
    });
  }

  updateTour(): void {
    if (this.tourForm.valid && this.editingTour) {
      const formValue = this.tourForm.value;
      const updatedTour: Tour = {
        ...this.editingTour,
        name: formValue.name || '',
        description: formValue.description || '',
        difficulty: formValue.difficulty || 1,
        category: formValue.category || 1,
        price: formValue.price || 0,
        date: new Date(formValue.date || '')
      };

      this.tourService.updateTour(updatedTour).subscribe({
        next: (updated) => {
          const index = this.tours.findIndex(t => t.id === updated.id);
          if (index !== -1) {
            this.tours[index] = updated;
          }
          this.hideCreateForm();
          console.log('Tour updated successfully:', updated);
        },
        error: (error) => {
          console.error('Error updating tour:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  deleteTour(tourId: number): void {
    if (confirm('Are you sure you want to delete this tour?')) {
      this.tourService.deleteTour(tourId).subscribe({
        next: () => {
          this.tours = this.tours.filter(t => t.id !== tourId);
          console.log('Tour deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting tour:', error);
        }
      });
    }
  }

  publishTour(tour: Tour): void {
    if (confirm('Are you sure you want to publish this tour? It will be visible to tourists.')) {
      const updatedTour = { ...tour, state: TourState.COMPLETE };
      
      this.tourService.updateTour(updatedTour).subscribe({
        next: (updated) => {
          const index = this.tours.findIndex(t => t.id === updated.id);
          if (index !== -1) {
            this.tours[index] = updated;
          }
          console.log('Tour published successfully');
        },
        error: (error) => {
          console.error('Error publishing tour:', error);
        }
      });
    }
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  getDifficultyName(difficultyId: number): string {
    const difficulty = this.difficulties.find(d => d.id === difficultyId);
    return difficulty ? difficulty.name : 'Unknown';
  }

  getTourStateName(state: TourState): string {
    return state === TourState.DRAFT ? 'Draft' : 'Published';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.tourForm.controls).forEach(key => {
      const control = this.tourForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getter methods for template validation
  get name() { return this.tourForm.get('name'); }
  get description() { return this.tourForm.get('description'); }
  get difficulty() { return this.tourForm.get('difficulty'); }
  get category() { return this.tourForm.get('category'); }
  get price() { return this.tourForm.get('price'); }
  get date() { return this.tourForm.get('date'); }
}