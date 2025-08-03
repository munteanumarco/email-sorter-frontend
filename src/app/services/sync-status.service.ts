import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { GmailAccountService, GmailAccount } from './gmail-account.service';

@Injectable({
  providedIn: 'root'
})
export class SyncStatusService {
  private accountsSubject = new BehaviorSubject<GmailAccount[]>([]);
  public accounts$ = this.accountsSubject.asObservable();

  private pollingInterval = 30000; // 30 seconds
  private isPolling = false;

  constructor(private gmailAccountService: GmailAccountService) {}

  startPolling() {
    if (this.isPolling) return;
    
    this.isPolling = true;
    console.log('Starting sync status polling');
    
    // Initial load
    this.refreshAccounts();

    // Set up polling
    interval(this.pollingInterval).subscribe(() => {
      console.log('Polling for account updates');
      this.refreshAccounts();
    });
  }

  private refreshAccounts() {
    this.gmailAccountService.getAccounts().subscribe({
      next: (accounts) => {
        console.log('Received updated accounts:', accounts);
        this.accountsSubject.next(accounts);
      },
      error: (error) => {
        console.error('Error fetching accounts:', error);
      }
    });
  }

  // Force an immediate refresh
  refreshNow() {
    this.refreshAccounts();
  }
}