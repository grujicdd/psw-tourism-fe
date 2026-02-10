import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TourProblemService } from '../tour-problem.service';
import { TourProblem, TourProblemStatus } from '../model/tour-problem.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportProblemDialogComponent } from '../report-problem-dialog/report-problem-dialog.component';

@Component({
  selector: 'xp-my-tour-problems',
  templateUrl: './my-tour-problems.component.html',
  styleUrls: ['./my-tour-problems.component.css']
})
export class MyTourProblemsComponent implements OnInit {

  problems: TourProblem[] = [];
  filteredProblems: TourProblem[] = [];
  loading: boolean = false;
  selectedFilter: string = 'all'; // all, pending, resolved, underReview, rejected

  constructor(
    private tourProblemService: TourProblemService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProblems();
  }

  loadProblems(): void {
    this.loading = true;
    this.tourProblemService.getMyProblems(0, 50).subscribe({
      next: (result) => {
        console.log('Tourist - Loaded problems:', result.results);
        this.problems = result.results;
        console.log('Tourist - Selected filter:', this.selectedFilter);
        // Apply initial filter
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

  openReportDialog(): void {
    const dialogRef = this.dialog.open(ReportProblemDialogComponent, {
      width: '500px',
      data: {
        tourId: 0,
        tourName: 'Enter Tour ID manually'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProblems();
      }
    });
  }

  applyFilter(filter?: string): void {
    const currentFilter = filter || this.selectedFilter;
    console.log('Tourist - Applying filter:', currentFilter);
    console.log('Tourist - Total problems:', this.problems.length);
    
    switch (currentFilter) {
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
    
    console.log('Tourist - Filtered problems:', this.filteredProblems.length);
    console.log('Tourist - Filtered problems:', this.filteredProblems);
    
    // Force Angular to detect the change
    this.cdr.detectChanges();
  }

  onFilterChange(filter: string): void {
    console.log('Tourist - Filter clicked:', filter);
    this.selectedFilter = filter;
    this.applyFilter(filter);
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

  getStatusCount(status: number): number {
    return this.problems.filter(p => p.status === status).length;
  }
}