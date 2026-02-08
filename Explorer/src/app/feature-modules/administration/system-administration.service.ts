import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { BlockedUser } from './model/blocked-user.model';

@Injectable({
  providedIn: 'root'
})
export class SystemAdministrationService {

  constructor(private http: HttpClient) { }

  getBlockedUsers(): Observable<BlockedUser[]> {
    return this.http.get<BlockedUser[]>(environment.apiHost + 'administration/blocked-users');
  }

  unblockUser(userId: number): Observable<BlockedUser> {
    return this.http.put<BlockedUser>(
      environment.apiHost + 'administration/unblock-user/' + userId, 
      {}
    );
  }
}