import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TourProblemService } from '../tour-problem.service';
import { CreateTourProblem } from '../model/tour-problem.model';

export interface ReportProblemDialogData {
  tourId: number;
  tourName: string;
}

@Component({
  selector: 'xp-report-problem-dialog',
  templateUrl: './report-problem-dialog.component.html',
  styleUrls: ['./report-problem-dialog.component.css']
})
export class ReportProblemDialogComponent {

  loading: boolean = false;

  problemForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)])
  });

  constructor(
    public dialogRef: MatDialogRef<ReportProblemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReportProblemDialogData,
    private tourProblemService: TourProblemService,
    private snackBar: MatSnackBar
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    if (this.problemForm.valid) {
      const createProblem: CreateTourProblem = {
        tourId: this.data.tourId,
        title: this.problemForm.value.title || '',
        description: this.problemForm.value.description || ''
      };

      this.loading = true;
      this.tourProblemService.reportProblem(createProblem).subscribe({
        next: (problem) => {
          this.snackBar.open('Problem reported successfully!', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error reporting problem:', error);
          const errorMessage = error.error?.errors?.[0] || 'Failed to report problem';
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
          this.loading = false;
        }
      });
    } else {
      this.markFormAsTouched();
    }
  }

  private markFormAsTouched(): void {
    Object.keys(this.problemForm.controls).forEach(key => {
      this.problemForm.get(key)?.markAsTouched();
    });
  }
}