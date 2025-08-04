import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { AgentLogsViewerComponent } from '../../agent-logs/agent-logs-viewer';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    AgentLogsViewerComponent
  ],
  templateUrl: './main-layout.html',
  styles: [`
    .layout-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #f5f5f5;

      .toolbar-spacer {
        flex: 1 1 auto;
      }

      mat-toolbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 2;
        background-color: #1a73e8;
        color: white;

        .app-title {
          color: white;
          text-decoration: none;
          font-size: 20px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: opacity 0.2s;

          &:hover {
            opacity: 0.9;
          }
        }
      }

      .sidenav-container {
        flex: 1;
        margin-top: 64px; // Height of toolbar
        min-height: calc(100vh - 64px);
      }

      .logs-sidenav {
        width: 400px;
        border-left: 1px solid #e0e0e0;
      }

      .main-content {
        padding: 20px;
      }
    }
  `]
})
export class MainLayoutComponent {
  showLogs = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}