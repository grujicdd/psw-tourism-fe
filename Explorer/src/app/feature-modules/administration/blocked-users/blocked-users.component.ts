import { Component, OnInit } from '@angular/core';
import { SystemAdministrationService } from '../system-administration.service';
import { BlockedUser } from '../model/blocked-user.model';

@Component({
  selector: 'xp-blocked-users',
  templateUrl: './blocked-users.component.html',
  styleUrls: ['./blocked-users.component.css']
})
export class BlockedUsersComponent implements OnInit {
  blockedUsers: BlockedUser[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  displayedColumns: string[] = ['username', 'name', 'surname', 'role', 'blockCount', 'actions'];

  constructor(private systemAdminService: SystemAdministrationService) { }

  ngOnInit(): void {
    this.loadBlockedUsers();
  }

  loadBlockedUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.systemAdminService.getBlockedUsers().subscribe({
      next: (users) => {
        this.blockedUsers = users;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load blocked users: ' + error.message;
        this.isLoading = false;
      }
    });
  }

  unblockUser(user: BlockedUser): void {
    if (!user.canBeUnblocked) {
      this.errorMessage = `${user.username} has been blocked 3 times and cannot be unblocked.`;
      return;
    }

    if (!confirm(`Are you sure you want to unblock user ${user.username}?`)) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.systemAdminService.unblockUser(user.id).subscribe({
      next: () => {
        this.successMessage = `User ${user.username} has been successfully unblocked.`;
        this.loadBlockedUsers();
      },
      error: (error) => {
        this.errorMessage = 'Failed to unblock user: ' + error.error.message || error.message;
        this.isLoading = false;
      }
    });
  }

  getBlockStatusText(user: BlockedUser): string {
    return `Blocked ${user.blockCount} time(s)`;
  }
}