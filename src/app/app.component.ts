import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task, User } from './models/task';
import { TaskService } from './services/task';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  todo: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];
  users: User[] = [];

  // Organized form object
  newTask = {
    title: '',
    assigned_to: null as number | null,
    description: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  };

  showEditModal = false;
  editingTask: Task | null = null;

  constructor(private taskService: TaskService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.taskService.getUsers().subscribe(u => this.users = u);
    this.taskService.getTasks().subscribe(tasks => {
      this.todo = tasks.filter(t => t.task_state_id == 1);
      this.inProgress = tasks.filter(t => t.task_state_id == 2);
      this.done = tasks.filter(t => t.task_state_id == 3);
      this.cdr.detectChanges();
    });
  }

  addTask() {
    if (!this.newTask.title || !this.newTask.assigned_to) {
      return alert("Title and Assignee are required!");
    }

    const taskData: Partial<Task> = {
      ...this.newTask,
      assigned_to: this.newTask.assigned_to || undefined,
      task_state_id: 1,
      org_id: 1,
      task_type_id: 1,
      created_by: 1
    };

    this.taskService.addTask(taskData).subscribe(() => {
      // Reset form
      this.newTask = { title: '', assigned_to: null, description: '', priority: 'MEDIUM' };
      this.loadData();
    });
  }

  openEdit(task: Task) {
    this.editingTask = { ...task };
    this.showEditModal = true;
  }

  saveUpdate() {
    if (this.editingTask) {
      this.taskService.updateTask(this.editingTask).subscribe(() => {
        this.showEditModal = false;
        this.loadData();
      });
    }
  }

  drop(event: CdkDragDrop<Task[]>, newState: number) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const task = event.container.data[event.currentIndex];
      task.task_state_id = newState;
      this.taskService.updateTask(task).subscribe();
    }
  }

  deleteTask(id?: number) {
    if (id && confirm('Permanently delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => this.loadData());
    }
  }
}
