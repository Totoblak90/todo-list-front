import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.scss'],
})
export class FoldersComponent implements OnInit {
  @Output() private onEdit: EventEmitter<[number, string]> = new EventEmitter();
  @Output() private onViewMoreItems: EventEmitter<number> = new EventEmitter();
  @Output() private onCreateFolder: EventEmitter<string> = new EventEmitter();
  @Output() private onDeleteFolder: EventEmitter<number> = new EventEmitter();
  @Input() public user: User;

  public showCreateFolderErrorMsg: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  public userWantsToEditFolder(id: number, folderName: string): void {
    this.onEdit.emit([id, folderName]);
  }

  public userWantsToViewTasks(folderId: number): void {
    this.onViewMoreItems.emit(folderId);
  }

  public userWantsToCreateFolder(name: string): void {
    this.showCreateFolderErrorMsg = false;

    name
      ? this.onCreateFolder.emit(name)
      : (this.showCreateFolderErrorMsg = true);
  }

  public userWantsToDeleteFolder(id: number) {
    this.onDeleteFolder.emit(id);
  }
}
