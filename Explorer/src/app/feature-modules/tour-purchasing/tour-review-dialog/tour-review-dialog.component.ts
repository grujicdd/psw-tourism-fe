// src/app/feature-modules/tour-purchasing/tour-review-dialog/tour-review-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TourReviewService } from '../tour-review.service';
import { Tour } from '../../tour-authoring/model/tour.model';

export interface ReviewDialogData {
  tour: Tour;
  purchaseId: number;
}

@Component({
  selector: 'xp-tour-review-dialog',
  templateUrl: './tour-review-dialog.component.html',
  styleUrls: ['./tour-review-dialog.component.css']
})
export class TourReviewDialogComponent implements OnInit {
  reviewForm: FormGroup;
  submitting = false;
  selectedRating = 0;
  hoveredRating = 0;

  constructor(
    private fb: FormBuilder,
    private reviewService: TourReviewService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<TourReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReviewDialogData
  ) {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['']
    });
  }

  ngOnInit(): void {
    // Watch rating changes to update comment validators
    this.reviewForm.get('rating')?.valueChanges.subscribe(rating => {
      const commentControl = this.reviewForm.get('comment');
      
      if (rating === 1 || rating === 2) {
        commentControl?.setValidators([Validators.required]);
      } else {
        commentControl?.clearValidators();
      }
      
      commentControl?.updateValueAndValidity();
    });
  }

  setRating(rating: number): void {
    this.selectedRating = rating;
    this.reviewForm.patchValue({ rating });
  }

  setHoveredRating(rating: number): void {
    this.hoveredRating = rating;
  }

  clearHoveredRating(): void {
    this.hoveredRating = 0;
  }

  getStarClass(starNumber: number): string {
    const rating = this.hoveredRating || this.selectedRating;
    return starNumber <= rating ? 'star-filled' : 'star-empty';
  }

  isCommentRequired(): boolean {
    const rating = this.reviewForm.get('rating')?.value;
    return rating === 1 || rating === 2;
  }

  submitReview(): void {
    if (this.reviewForm.valid) {
      this.submitting = true;

      const review = {
        tourPurchaseId: this.data.purchaseId,
        tourId: this.data.tour.id,
        rating: this.reviewForm.value.rating,
        comment: this.reviewForm.value.comment || undefined
      };

      this.reviewService.createReview(review).subscribe({
        next: (result) => {
          this.snackBar.open('Review submitted successfully!', 'Close', {
            duration: 3000
          });
          this.dialogRef.close(result);
        },
        error: (error) => {
          this.submitting = false;
          const errorMessage = error.error?.message || 'Failed to submit review. Please try again.';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000
          });
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.reviewForm.controls).forEach(key => {
        this.reviewForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}