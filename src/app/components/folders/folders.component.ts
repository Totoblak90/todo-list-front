import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.scss'],
})
export class FoldersComponent implements OnInit {
  @Output() private onEdit: EventEmitter<number> = new EventEmitter();
  @Output() private onViewMoreItems: EventEmitter<boolean> = new EventEmitter();
  @Output() private onCreateFolder: EventEmitter<string> = new EventEmitter();
  @Output() private onDeleteFolder: EventEmitter<number> = new EventEmitter();
  @Input() public user: User;

  constructor() {}

  ngOnInit(): void {}

  public userWantsToEditFolder(id: number): void {
    this.onEdit.emit(id);
  }

  public userWantsToViewTasks(): void {
    this.onViewMoreItems.emit(true);
  }

  public userWantsToCreateFolder(name: string): void {
    this.onCreateFolder.emit(name);
  }

  public userWantsToDeleteFolder(id: number) {
    this.onDeleteFolder.emit(id);
  }
}
