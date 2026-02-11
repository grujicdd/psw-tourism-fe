import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { TourProblem, CreateTourProblem } from './model/tour-problem.model';
import { PagedResult } from '../tour-authoring/model/paged-result.model';

@Injectable({
  providedIn: 'root'
})
export class TourProblemService {

  constructor(private http: HttpClient) { }

  // TOURIST ENDPOINTS
  reportProblem(problem: CreateTourProblem): Observable<TourProblem> {
    return this.http.post<TourProblem>(
      environment.apiHost + 'tourist/tour-problems',
      problem
    );
  }

  getMyProblems(page: number = 0, pageSize: number = 10): Observable<PagedResult<TourProblem>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<TourProblem>>(
      environment.apiHost + 'tourist/tour-problems',
      { params }
    );
  }

  getProblemById(id: number): Observable<TourProblem> {
    return this.http.get<TourProblem>(
      environment.apiHost + `tourist/tour-problems/${id}`
    );
  }

  // GUIDE ENDPOINTS
  getGuideTourProblems(page: number = 0, pageSize: number = 10): Observable<PagedResult<TourProblem>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<TourProblem>>(
      environment.apiHost + 'author/tour-problems',
      { params }
    );
  }

  markAsResolved(problemId: number): Observable<TourProblem> {
    return this.http.put<TourProblem>(
      environment.apiHost + `author/tour-problems/${problemId}/resolve`,
      {}
    );
  }

  sendToAdministrator(problemId: number): Observable<TourProblem> {
    return this.http.put<TourProblem>(
      environment.apiHost + `author/tour-problems/${problemId}/send-to-admin`,
      {}
    );
  }

  // ADMIN ENDPOINTS
  getProblemsUnderReview(page: number = 0, pageSize: number = 10): Observable<PagedResult<TourProblem>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResult<TourProblem>>(
      environment.apiHost + 'administrator/tour-problems/under-review',
      { params }
    );
  }

  returnToGuide(problemId: number): Observable<TourProblem> {
    return this.http.put<TourProblem>(
      environment.apiHost + `administrator/tour-problems/${problemId}/return-to-guide`,
      {}
    );
  }

  rejectProblem(problemId: number): Observable<TourProblem> {
    return this.http.put<TourProblem>(
      environment.apiHost + `administrator/tour-problems/${problemId}/reject`,
      {}
    );
  }
}