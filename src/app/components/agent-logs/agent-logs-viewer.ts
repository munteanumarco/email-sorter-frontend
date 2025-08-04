import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { AgentLogsService, AgentLog } from '../../services/agent-logs.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-agent-logs-viewer',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule
  ],
  template: `
    <mat-card class="logs-card">
      <mat-card-header>
        <mat-card-title>Agent Activity Logs</mat-card-title>
        <mat-card-subtitle>Real-time agent actions and status</mat-card-subtitle>
      </mat-card-header>
      
      <mat-card-content>
        <div class="logs-container">
          <div class="status-line" *ngFor="let log of logs">
            <mat-icon [class]="log.type">{{ getIconForType(log.type) }}</mat-icon>
            <div class="log-content">
              <span class="timestamp">{{ log.timestamp | date:'HH:mm:ss' }}</span>
              <span [class]="'message ' + log.type">{{ log.message }}</span>
            </div>
          </div>
          
          <div *ngIf="isLoading" class="loading-line">
            <mat-spinner diameter="20"></mat-spinner>
            <span>Fetching logs...</span>
          </div>
          
          <div *ngIf="!isLoading && logs.length === 0" class="empty-state">
            <mat-icon>history</mat-icon>
            <span>No agent activity logs available</span>
          </div>
        </div>
      </mat-card-content>
      
      <mat-card-actions align="end">
        <button mat-button (click)="clearLogs()">Clear</button>
        <button mat-button color="primary" (click)="refreshLogs()">
          <mat-icon>refresh</mat-icon>
          Refresh
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .logs-card {
      margin: 16px;
      max-width: 800px;
    }

    .logs-container {
      min-height: 200px;
      max-height: 400px;
      overflow-y: auto;
      padding: 8px;
    }

    .status-line {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 12px;
      font-family: monospace;
    }

    .log-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .timestamp {
      font-size: 0.85em;
      color: #666;
    }

    .message {
      white-space: pre-wrap;
      word-break: break-word;
    }

    .loading-line {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      color: #666;
      justify-content: center;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      margin-top: 32px;
      color: #666;
    }

    mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;

      &.info {
        color: #1976d2;
      }

      &.success {
        color: #4caf50;
      }

      &.warning {
        color: #ff9800;
      }

      &.error {
        color: #f44336;
      }

      &.debug {
        color: #9e9e9e;
      }
    }

    .message {
      &.info {
        color: #1976d2;
      }

      &.success {
        color: #4caf50;
      }

      &.warning {
        color: #ff9800;
      }

      &.error {
        color: #f44336;
      }

      &.debug {
        color: #666;
      }
    }
  `]
})
export class AgentLogsViewerComponent implements OnInit, OnDestroy {
  logs: AgentLog[] = [];
  isLoading = false;
  private destroy$ = new Subject<void>();
  private autoRefreshInterval: any;

  constructor(private agentLogsService: AgentLogsService) {}

  ngOnInit() {
    this.refreshLogs();
    // Auto-refresh logs every 5 seconds
    this.autoRefreshInterval = setInterval(() => {
      this.refreshLogs();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  getIconForType(type: string): string {
    switch (type) {
      case 'info': return 'info';
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'debug': return 'code';
      default: return 'info';
    }
  }

  clearLogs() {
    this.logs = [];
  }

  refreshLogs() {
    this.isLoading = true;
    this.agentLogsService.getLatestLogs()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (logs) => {
          this.logs = logs;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to fetch agent logs:', error);
          this.isLoading = false;
        }
      });
  }
}