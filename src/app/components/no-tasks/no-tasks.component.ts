import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-no-tasks',
  templateUrl: './no-tasks.component.html',
  styleUrls: ['./no-tasks.component.scss'],
})
export class NoTasksComponent implements OnInit {
  @Output() private onCreateTodo: EventEmitter<string> = new EventEmitter();
  @Input() public user: User;
  public showCreateTodoErrorMsg: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  public userWantsToCreateTask(todoName: string): void {
    this.showCreateTodoErrorMsg = false;

    todoName && todoName.length > 3
      ? this.onCreateTodo.emit(todoName)
      : (this.showCreateTodoErrorMsg = true);
  }
}
