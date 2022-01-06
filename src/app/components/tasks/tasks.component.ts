import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo } from 'src/app/interfaces/todos.interface';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  @Input() public todos: Todo[] = [];
  @Output() private onCreateTodo: EventEmitter<string> = new EventEmitter();
  @Output() private onEditTodoName: EventEmitter<[number, string]> =
    new EventEmitter();
  @Output() private onEditTodoStatus: EventEmitter<[number, boolean]> =
    new EventEmitter();
  @Output() private onDeleteTodo: EventEmitter<number> = new EventEmitter();
  public showCreateTodoErrorMsg: boolean = false;
  public checkbox: boolean = false;
  constructor() {}

  ngOnInit(): void {}

  public userWantsToCreateTodo(todoName: string): void {
    this.showCreateTodoErrorMsg = false;

    todoName && todoName.length > 3
      ? this.onCreateTodo.emit(todoName)
      : (this.showCreateTodoErrorMsg = true);
  }

  public userWantsToEditTodo(id: number, name: string): void {
    this.onEditTodoName.emit([id, name]);
  }

  public userWantsToEditTodoStatus(id: number, status: boolean): void {
    this.onEditTodoStatus.emit([id, status]);
  }

  public userWantsToDeleteTodo(id: number): void {
    this.onDeleteTodo.emit(id);
  }
}
