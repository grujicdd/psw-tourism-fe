// File: Explorer/src/app/feature-modules/stakeholders/tourist-profile/tourist-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TouristProfileService } from '../tourist-profile.service';
import { TouristProfile, INTERESTS, Interest } from '../model/tourist-profile.model';

@Component({
  selector: 'xp-tourist-profile',
  templateUrl: './tourist-profile.component.html',
  styleUrls: ['./tourist-profile.component.css']
})
export class TouristProfileComponent implements OnInit {
  profileForm: FormGroup;
  profile: TouristProfile | null = null;
  interests = INTERESTS;
  loading = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private profileService: TouristProfileService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      interestIds: [[], Validators.required],
      receiveRecommendations: [true]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.profileForm.patchValue({
          interestIds: profile.interestIds,
          receiveRecommendations: profile.receiveRecommendations
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.snackBar.open('Failed to load profile. Please try again.', 'Close', {
          duration: 5000
        });
        this.loading = false;
      }
    });
  }

  isInterestSelected(interestId: number): boolean {
    const selectedIds = this.profileForm.get('interestIds')?.value || [];
    return selectedIds.includes(interestId);
  }

  toggleInterest(interestId: number): void {
    const currentIds = this.profileForm.get('interestIds')?.value || [];
    let newIds: number[];

    if (currentIds.includes(interestId)) {
      newIds = currentIds.filter((id: number) => id !== interestId);
    } else {
      newIds = [...currentIds, interestId];
    }

    this.profileForm.patchValue({ interestIds: newIds });
  }

  onSubmit(): void {
    const interestIds = this.profileForm.get('interestIds')?.value || [];
    
    if (interestIds.length === 0) {
      this.snackBar.open('Please select at least one interest.', 'Close', {
        duration: 3000
      });
      return;
    }

    this.saving = true;
    const updateData = this.profileForm.value;

    this.profileService.updateProfile(updateData).subscribe({
      next: (updatedProfile) => {
        this.profile = updatedProfile;
        this.saving = false;
        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.saving = false;
        this.snackBar.open('Failed to update profile. Please try again.', 'Close', {
          duration: 5000
        });
      }
    });
  }

  onCancel(): void {
    if (this.profile) {
      this.profileForm.patchValue({
        interestIds: this.profile.interestIds,
        receiveRecommendations: this.profile.receiveRecommendations
      });
      this.snackBar.open('Changes discarded', 'Close', {
        duration: 2000
      });
    }
  }

  getInterestIcon(interestId: number): string {
    const iconMap: { [key: number]: string } = {
      1: 'nature',
      2: 'palette',
      3: 'sports_soccer',
      4: 'shopping_cart',
      5: 'restaurant'
    };
    return iconMap[interestId] || 'star';
  }

  getCategoryName(categoryId: number): string {
    const interest = this.interests.find(i => i.id === categoryId);
    return interest ? interest.name : 'Unknown';
  }

  getDifficultyName(difficultyId: number): string {
    const difficulties = ['Easy', 'Moderate', 'Hard', 'Expert'];
    return difficulties[difficultyId - 1] || 'Unknown';
  }
}