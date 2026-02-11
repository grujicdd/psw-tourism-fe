// src/app/feature-modules/tour-authoring/available-replacements/available-replacements.component.ts
import { Component, OnInit } from '@angular/core';
import { TourReplacementService, AvailableTourReplacement } from '../tour-replacement.service';

@Component({
  selector: 'xp-available-replacements',
  templateUrl: './available-replacements.component.html',
  styleUrls: ['./available-replacements.component.css']
})
export class AvailableReplacementsComponent implements OnInit {
  availableReplacements: AvailableTourReplacement[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private replacementService: TourReplacementService) {}

  ngOnInit(): void {
    this.loadAvailableReplacements();
  }

  loadAvailableReplacements(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.replacementService.getAvailableReplacements(0, 20).subscribe({
      next: (result) => {
        this.availableReplacements = result.results;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load available replacements';
        console.error('Error loading available replacements:', error);
        this.isLoading = false;
      }
    });
  }

  acceptReplacement(replacement: AvailableTourReplacement): void {
    if (!confirm(`Are you sure you want to accept this replacement for "${replacement.tourName}"? You will become the new guide for this tour.`)) {
      return;
    }

    this.replacementService.acceptReplacement(replacement.replacementId).subscribe({
      next: () => {
        this.successMessage = `Successfully accepted replacement for "${replacement.tourName}"!`;
        this.loadAvailableReplacements(); // Refresh the list
        setTimeout(() => this.successMessage = '', 5000);
      },
      error: (error) => {
        this.errorMessage = error.error || 'Failed to accept replacement';
        console.error('Error accepting replacement:', error);
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  getCategoryName(categoryId: number): string {
    const categories = ['Nature', 'Art', 'Sports', 'Shopping', 'Food'];
    return categories[categoryId - 1] || 'Unknown';
  }

  getDifficultyName(difficulty: number): string {
    const difficulties = ['Easy', 'Medium', 'Hard', 'Very Hard', 'Extreme'];
    return difficulties[difficulty - 1] || 'Unknown';
  }

  getDifficultyColor(difficulty: number): string {
    if (difficulty <= 2) return 'primary';
    if (difficulty <= 3) return 'accent';
    return 'warn';
  }
}