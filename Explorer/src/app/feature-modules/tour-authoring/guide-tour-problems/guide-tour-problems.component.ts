import { Component, OnInit } from '@angular/core';
import { TourProblemService } from '../../tour-purchasing/tour-problem.service';
import { TourProblem, TourProblemStatus } from '../../tour-purchasing/model/tour-problem.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'xp-guide-tour-problems',
  templateUrl: './guide-tour-problems.component.html',
  styleUrls: ['./guide-tour-problems.component.css']
})
export class GuideTourProblemsComponent implements OnInit {

  problems: TourProblem[] = [];
  filteredProblems: TourProblem[] = [];
  loading: boolean = false;
  selectedFilter: string = 'active'; // active, all, pending, resolved, underReview, rejected
  displayedColumns: string[] = ['tourName', 'title', 'description', 'status', 'reportedAt', 'actions'];

  constructor(
    private tourProblemService: TourProblemService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProblems();
  }

  loadProblems(): void {
    this.loading = true;
    this.tourProblemService.getGuideTourProblems(0, 100).subscribe({
      next: (result) => {
        console.log('Guide - Loaded problems:', result.results);
        this.problems = result.results;
        console.log('Guide - Selected filter:', this.selectedFilter);
        // Apply initial filter explicitly
        this.applyFilter(this.selectedFilter);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading problems:', error);
        this.snackBar.open('Failed to load problems', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  applyFilter(filter?: string): void {
    const currentFilter = filter || this.selectedFilter;
    console.log('Guide - Applying filter:', currentFilter);
    console.log('Guide - Total problems:', this.problems.length);
    
    switch (currentFilter) {
      case 'active':
        // Show only pending and under review (actionable items)
        this.filteredProblems = this.problems.filter(p => 
          p.status === TourProblemStatus.Pending || p.status === TourProblemStatus.UnderReview
        );
        break;
      case 'pending':
        this.filteredProblems = this.problems.filter(p => p.status === TourProblemStatus.Pending);
        break;
      case 'resolved':
        this.filteredProblems = this.problems.filter(p => p.status === TourProblemStatus.Resolved);
        break;
      case 'underReview':
        this.filteredProblems = this.problems.filter(p => p.status === TourProblemStatus.UnderReview);
        break;
      case 'rejected':
        this.filteredProblems = this.problems.filter(p => p.status === TourProblemStatus.Rejected);
        break;
      default:
        this.filteredProblems = [...this.problems];
    }
    
    console.log('Guide - Filtered problems:', this.filteredProblems.length);
    console.log('Guide - Filtered problems:', this.filteredProblems);
  }

  onFilterChange(filter: string): void {
    console.log('Guide - Filter clicked:', filter);
    this.selectedFilter = filter;
    this.applyFilter(filter);
  }

  markAsResolved(problem: TourProblem): void {
    if (confirm(`Mark problem "${problem.title}" as resolved?`)) {
      this.loading = true;
      this.tourProblemService.markAsResolved(problem.id).subscribe({
        next: (updated) => {
          this.snackBar.open('Problem marked as resolved! Switching to "All" view.', 'Close', { duration: 3000 });
          // Switch to 'all' filter so user can see the resolved problem
          this.selectedFilter = 'all';
          this.loadProblems();
        },
        error: (error) => {
          console.error('Error resolving problem:', error);
          const errorMessage = error.error?.errors?.[0] || 'Failed to resolve problem';
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
          this.loading = false;
        }
      });
    }
  }

  sendToAdmin(problem: TourProblem): void {
    if (confirm(`Send problem "${problem.title}" to administrator for review?`)) {
      this.loading = true;
      this.tourProblemService.sendToAdministrator(problem.id).subscribe({
        next: (updated) => {
          this.snackBar.open('Problem sent to administrator. Still visible in "Active" filter.', 'Close', { duration: 3000 });
          // Keep current filter (it's still in UnderReview which is part of Active)
          this.loadProblems();
        },
        error: (error) => {
          console.error('Error sending to admin:', error);
          const errorMessage = error.error?.errors?.[0] || 'Failed to send problem to administrator';
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
          this.loading = false;
        }
      });
    }
  }

  getStatusColor(status: number): string {
    switch (status) {
      case TourProblemStatus.Pending:
        return 'accent';
      case TourProblemStatus.Resolved:
        return 'primary';
      case TourProblemStatus.UnderReview:
        return 'warn';
      case TourProblemStatus.Rejected:
        return '';
      default:
        return '';
    }
  }

  getStatusText(statusName: string): string {
    const statusMap: { [key: string]: string } = {
      'Pending': 'Na čekanju',
      'Resolved': 'Rešen',
      'UnderReview': 'Na reviziji',
      'Rejected': 'Odbačen'
    };
    return statusMap[statusName] || statusName;
  }

  isPending(problem: TourProblem): boolean {
    return problem.status === TourProblemStatus.Pending;
  }

  isUnderReview(problem: TourProblem): boolean {
    return problem.status === TourProblemStatus.UnderReview;
  }

  getStatusCount(status: number | string): number {
    if (status === 'active') {
      return this.problems.filter(p => 
        p.status === TourProblemStatus.Pending || p.status === TourProblemStatus.UnderReview
      ).length;
    }
    return this.problems.filter(p => p.status === status).length;
  }
}