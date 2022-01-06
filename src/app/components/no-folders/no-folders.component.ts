import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../models/User';

@Component({
  selector: 'app-no-folders',
  templateUrl: './no-folders.component.html',
  styleUrls: ['./no-folders.component.scss'],
})
export class NoFoldersComponent implements OnInit {
  @Output() private onCreateFolder: EventEmitter<string> = new EventEmitter();
  @Input() public user: User;
  public showCreateFolderErrorMsg: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  public userWantsToCreateFolder(folderName) {
    this.showCreateFolderErrorMsg = false;

    folderName && folderName.length >= 3
      ? this.onCreateFolder.emit(folderName)
      : (this.showCreateFolderErrorMsg = true);
  }
}
