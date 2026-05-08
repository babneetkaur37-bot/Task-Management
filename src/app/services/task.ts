import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, User } from '../models/task';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = 'http://localhost:8000/tasks.php';
  private userUrl = 'http://localhost:8000/users.php';

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> { return this.http.get<Task[]>(this.apiUrl); }
  getUsers(): Observable<User[]> { return this.http.get<User[]>(this.userUrl); }

  addTask(task: Partial<Task>): Observable<any> { return this.http.post(this.apiUrl, task); }
  updateTask(task: Task): Observable<any> { return this.http.put(this.apiUrl, task); }
  deleteTask(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}?id=${id}`); }
}
