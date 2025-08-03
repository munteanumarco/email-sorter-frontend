import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../services/auth';
import { GmailAccountService } from '../../../services/gmail-account.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="callback-container">
      <mat-spinner></mat-spinner>
      <p>{{ error || message }}</p>
    </div>
  `,
  styles: [`
    .callback-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 24px;
      
      p {
        color: #5f6368;
      }
    }
  `]
})
export class CallbackComponent implements OnInit {
  error: string | null = null;
  message: string = 'Completing authentication...';

  constructor(
    private authService: AuthService,
    private gmailAccountService: GmailAccountService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    console.log('Callback component initialized');
    
    try {
      this.route.queryParams.subscribe(async params => {
        console.log('Callback params:', params);
        
        if (!params) {
          throw new Error('No query parameters received');
        }

        const error = params['error'];
        const message = params['message'];
        const gmailAccountId = params['gmail_account_id'];
        const accessToken = params['access_token'];
        
        try {
          if (error) {
            throw new Error(error);
          }

          // Handle Gmail account connection success
          if (message && gmailAccountId) {
            console.log('Account connection successful:', { message, gmailAccountId });
            this.message = message;
            
            // Start initial sync
            this.gmailAccountService.syncAllAccounts().subscribe({
              next: () => {
                console.log('Initial sync triggered successfully');
                this.message = 'Account connected and sync started!';
                setTimeout(() => this.router.navigate(['/gmail-accounts']), 1500);
              },
              error: (error) => {
                console.error('Error triggering sync:', error);
                this.message = 'Account connected! Redirecting...';
                setTimeout(() => this.router.navigate(['/gmail-accounts']), 1500);
              }
            });
            return;
          }

          // Handle login success
          if (accessToken) {
            console.log('Login successful, handling callback');
            await this.authService.handleDirectCallback(params);
            const returnUrl = localStorage.getItem('returnUrl');
            localStorage.removeItem('returnUrl');
            await this.router.navigate([returnUrl || '/dashboard']);
            return;
          }

          throw new Error('Invalid response format');
        } catch (error) {
          console.error('Error during callback:', error);
          this.error = error instanceof Error ? error.message : 'Authentication failed';
          
          // If we have a message, this was a connect flow
          if (message) {
            setTimeout(() => this.router.navigate(['/gmail-accounts']), 3000);
          } else {
            // Otherwise it was a login flow
            this.authService.logout();
            setTimeout(() => this.router.navigate(['/login']), 3000);
          }
        }
      });
    } catch (error) {
      console.error('Callback error:', error);
      this.error = error instanceof Error ? error.message : 'Failed to complete authentication';
      this.authService.logout();
      setTimeout(() => this.router.navigate(['/login']), 3000);
    }
  }
}