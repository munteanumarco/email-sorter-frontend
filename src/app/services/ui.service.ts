import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private showLogsSource = new Subject<void>();
  showLogs$ = this.showLogsSource.asObservable();

  showAgentLogs() {
    this.showLogsSource.next();
  }
}