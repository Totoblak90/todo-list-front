import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';
import { Folder } from 'src/app/interfaces/folder.interface';
import { FoldersService } from '../../services/folders.service';
import { Subject, take, takeUntil } from 'rxjs';
import { unknownErrorAlert } from 'src/app/helpers/alerts';
import { noConectionAlert } from '../../helpers/alerts';
import {
  CreateFolderRequest,
  EditFolderRequest,
} from '../../interfaces/folder.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public viewingTodos: boolean = false;
  public folderToInspect: Folder;
  private destroy$: Subject<boolean> = new Subject();
  public get user(): User {
    return this.authService.getUser();
  }

  constructor(
    private authService: AuthService,
    private foldersService: FoldersService
  ) {}

  ngOnInit(): void {}

  public async editFolder(folderData: [number, string]): Promise<void> {
    const [folderID, oldFolderName] = [folderData[0], folderData[1]];

    const inputValue: string = oldFolderName;

    const { value: newFolderName } = await Swal.fire({
      title: 'Enter the name of the folder',
      input: 'text',
      inputLabel: 'Folder name',
      inputValue: inputValue,
      showCancelButton: true,
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp',
      },
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
      },
    });

    if (newFolderName) {
      this.editFolderNameInDatabase(folderID, newFolderName);
    }
  }

  private editFolderNameInDatabase(
    folderId: number,
    newFolderName: string
  ): void {
    const payload: EditFolderRequest = {
      name: newFolderName,
    };
    this.foldersService
      .editFolder(folderId, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          res?.meta?.status === 200 || res?.meta?.status === 201
            ? this.correctEditedFolder(res?.data?.folder)
            : unknownErrorAlert();
        },
        error: (err) => console.log(err),
      });
  }

  private correctEditedFolder(folder: Folder): void {
    const index: number = this.user.Folders.findIndex(
      (f) => f.id === folder.id
    );
    this.user.Folders[index] = folder;
  }

  public viewTasks(folderID: number) {
    this.viewingTodos = true;
    this.folderToInspect = this.user.Folders.find(
      (folder) => (folder.id = folderID)
    );
  }

  public deleteFolder(folderId: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-primary',
        denyButton: 'btn btn-danger',
      },
      buttonsStyling: true,
    });
    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure you want to delete the folder?',
        text: 'This will delete all the content inside of it',
        showDenyButton: true,
        confirmButtonText: 'Yes, proceed',
        denyButtonText: `No!!`,
      })
      .then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.deleteFolderFromDatabase(folderId);
        }
      });
  }

  private deleteFolderFromDatabase(folderId: number): void {
    this.foldersService
      .deleteFolder(folderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          res?.meta?.status === 200 || res?.meta?.status === 201
            ? this.rearrangeFolderArray(folderId)
            : unknownErrorAlert();
        },
        error: () => noConectionAlert(),
      });
  }

  private rearrangeFolderArray(folderId: number) {
    const newFolderArray: Folder[] = this.user.Folders.filter(
      (folder: Folder) => folder.id !== folderId
    );

    const u: User = new User(
      this.user.id,
      this.user.email,
      this.user.created_at,
      this.user.updated_at,
      newFolderArray,
      this.user.Todos
    );

    this.authService.setUser(u);
  }

  public createNewFolder(name: string) {
    const object: CreateFolderRequest = {
      users_id: this.user.id,
      name,
    };
    this.foldersService
      .createFolder(object)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          res?.meta?.status === 200 || res?.meta?.status === 201
            ? this.setUserWithNewFolder(res?.data?.folder)
            : unknownErrorAlert();
        },
        error: (err) => noConectionAlert(),
      });
  }

  private setUserWithNewFolder(folder: Folder): void {
    const newFolders: Folder[] = [...this.user.Folders, folder];
    const u: User = new User(
      this.user.id,
      this.user.email,
      this.user.created_at,
      this.user.updated_at,
      newFolders,
      this.user.Todos
    );

    this.authService.setUser(u);
  }
}
