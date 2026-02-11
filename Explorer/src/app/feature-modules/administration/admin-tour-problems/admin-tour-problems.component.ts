import { Component, OnInit } from '@angular/core';
import { TourProblemService } from '../../tour-purchasing/tour-problem.service';
import { TourProblem, TourProblemStatus } from '../../tour-purchasing/model/tour-problem.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-admin-tour-problems',
  templateUrl: './admin-tour-problems.component.html',
  styleUrls: ['./admin-tour-problems.component.css']
})
export class AdminTourProblemsComponent implements OnInit {

  problems: TourProblem[] = [];
  loading: boolean = false;
  displayedColumns: string[] = ['tourName', 'title', 'description', 'reportedAt', 'reviewRequestedAt', 'actions'];

  constructor(
    private tourProblemService: TourProblemService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProblemsUnderReview();
  }

  loadProblemsUnderReview(): void {
    this.loading = true;
    this.tourProblemService.getProblemsUnderReview(0, 50).subscribe({
      next: (result) => {
        this.problems = result.results;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading problems:', error);
        this.snackBar.open('Failed to load problems', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  returnToGuide(problem: TourProblem): void {
    if (confirm(`Return problem "${problem.title}" to the guide for resolution?`)) {
      this.loading = true;
      this.tourProblemService.returnToGuide(problem.id).subscribe({
        next: (updated) => {
          this.snackBar.open('Problem returned to guide', 'Close', { duration: 3000 });
          this.loadProblemsUnderReview();
        },
        error: (error) => {
          console.error('Error returning to guide:', error);
          const errorMessage = error.error?.errors?.[0] || 'Failed to return problem to guide';
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
          this.loading = false;
        }
      });
    }
  }

  rejectProblem(problem: TourProblem): void {
    if (confirm(`Reject problem "${problem.title}"? This action marks the problem as invalid.`)) {
      this.loading = true;
      this.tourProblemService.rejectProblem(problem.id).subscribe({
        next: (updated) => {
          this.snackBar.open('Problem rejected', 'Close', { duration: 3000 });
          this.loadProblemsUnderReview();
        },
        error: (error) => {
          console.error('Error rejecting problem:', error);
          const errorMessage = error.error?.errors?.[0] || 'Failed to reject problem';
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
          this.loading = false;
        }
      });
    }
  }
}