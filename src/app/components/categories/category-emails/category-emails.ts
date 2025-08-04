import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { EmailService, Email } from '../../../services/email';
import { CategoryService, Category } from '../../../services/category';
import { EmailViewDialogComponent } from '../../emails/email-view-dialog/email-view-dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-category-emails',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatChipsModule
  ],
  templateUrl: './category-emails.html',
  styleUrls: ['./category-emails.scss']
})
export class CategoryEmailsComponent implements OnInit {
  category?: Category;
  emails: Email[] = [];
  isLoading = true;
  selectedEmails = new Set<number>();

  constructor(
    private route: ActivatedRoute,
    private emailService: EmailService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const categoryId = Number(this.route.snapshot.paramMap.get('id'));
    if (categoryId) {
      this.loadCategory(categoryId);
      this.loadEmails(categoryId);
    }
  }

  private loadCategory(id: number) {
    this.categoryService.getCategory(id).subscribe({
      next: (category) => {
        this.category = category;
      },
      error: (error) => {
        console.error('Error loading category:', error);
        this.snackBar.open('Failed to load category', 'Dismiss', { duration: 3000 });
      }
    });
  }

  private loadEmails(categoryId: number) {
    this.isLoading = true;
    this.emailService.getEmails(categoryId).subscribe({
      next: (emails) => {
        this.emails = emails;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading emails:', error);
        this.snackBar.open('Failed to load emails', 'Dismiss', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  toggleEmailSelection(emailId: number) {
    if (this.selectedEmails.has(emailId)) {
      this.selectedEmails.delete(emailId);
    } else {
      this.selectedEmails.add(emailId);
    }
  }

  selectAllEmails() {
    if (this.selectedEmails.size === this.emails.length) {
      this.selectedEmails.clear();
    } else {
      this.selectedEmails = new Set(this.emails.map(e => e.id));
    }
  }

  deleteSelectedEmails() {
    if (this.selectedEmails.size === 0) return;

    const emailCount = this.selectedEmails.size;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete ${emailCount} ${emailCount === 1 ? 'email' : 'emails'}? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        const emailIds = Array.from(this.selectedEmails);
        this.emailService.bulkDeleteEmails(emailIds).subscribe({
          next: () => {
            this.snackBar.open('Emails deleted successfully', '', { 
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar']
            });
            this.selectedEmails.clear();
            this.loadEmails(this.category!.id);
          },
          error: (error) => {
            console.error('Error deleting emails:', error);
            this.snackBar.open('Failed to delete emails', '', { 
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  unsubscribeFromSelected() {
    if (this.selectedEmails.size === 0) return;

    const emailCount = this.selectedEmails.size;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Unsubscribe',
        message: `Are you sure you want to unsubscribe from ${emailCount} ${emailCount === 1 ? 'sender' : 'senders'}?`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        const emailIds = Array.from(this.selectedEmails);
        this.emailService.unsubscribeFromEmails(emailIds).subscribe({
          next: (response: {
            message: string;
            results: Array<{
              email_id: number;
              status: string;
              unsubscribe_link: string;
            }>;
          }) => {
            // Update email statuses immediately
            response.results.forEach(result => {
              const email = this.emails.find(e => e.id === result.email_id);
              if (email) {
                email.unsubscribe_status = 'pending';
              }
            });

            this.snackBar.open('Unsubscribe requests sent successfully', '', { 
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar']
            });
            this.selectedEmails.clear();

            // Start polling for status updates
            const pollInterval = setInterval(() => {
              this.loadEmails(this.category!.id);
              // Check if all selected emails are no longer pending
              const allCompleted = response.results.every(result => {
                const email = this.emails.find(e => e.id === result.email_id);
                return email && email.unsubscribe_status !== 'pending';
              });
              if (allCompleted) {
                clearInterval(pollInterval);
              }
            }, 5000); // Poll every 5 seconds

            // Stop polling after 2 minutes
            setTimeout(() => clearInterval(pollInterval), 120000);
          },
          error: (error: any) => {
            console.error('Error processing unsubscribe requests:', error);
            this.snackBar.open('Failed to process unsubscribe requests', '', { 
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  viewEmail(email: Email, event: MouseEvent) {
    // Don't trigger if clicking the checkbox
    if ((event.target as HTMLElement).closest('.email-checkbox')) {
      return;
    }

    this.dialog.open(EmailViewDialogComponent, {
      data: email,
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh'
    });
  }
}