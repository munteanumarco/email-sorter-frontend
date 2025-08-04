import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AgentLog {
  type: 'info' | 'success' | 'warning' | 'error' | 'debug';
  message: string;
  timestamp: string;
  agent_id?: string;
  task_id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgentLogsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getLatestLogs(): Observable<AgentLog[]> {
    return this.http.get<AgentLog[]>(`${this.apiUrl}/agent-logs/latest/`);
  }

  getLogsByTaskId(taskId: string): Observable<AgentLog[]> {
    return this.http.get<AgentLog[]>(`${this.apiUrl}/agent-logs/task/${taskId}/`);
  }

  getLogsByAgentId(agentId: string): Observable<AgentLog[]> {
    return this.http.get<AgentLog[]>(`${this.apiUrl}/agent-logs/agent/${agentId}/`);
  }
}