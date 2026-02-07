import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { TouristProfile, UpdateTouristProfile } from './model/tourist-profile.model';

@Injectable({
  providedIn: 'root'
})
export class TouristProfileService {

  constructor(private http: HttpClient) { }

  getProfile(): Observable<TouristProfile> {
    return this.http.get<TouristProfile>(environment.apiHost + 'tourist/profile');
  }

  updateProfile(profile: UpdateTouristProfile): Observable<TouristProfile> {
    return this.http.put<TouristProfile>(environment.apiHost + 'tourist/profile', profile);
  }
}