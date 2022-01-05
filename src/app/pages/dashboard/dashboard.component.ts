import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';
import { Folder } from 'src/app/interfaces/folder.interface';
import { FoldersService } from '../../services/folders.service';
import { Subject, take, takeUntil } from 'rxjs';
import { unknownErrorAlert } from 'src/app/helpers/alerts';
import { noConectionAlert } from '../../helpers/alerts';
import { CreateFolderRequest } from '../../interfaces/folder.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private destroy$: Subject<boolean> = new Subject();
  public get user(): User {
    return this.authService.getUser();
  }

  constructor(
    private authService: AuthService,
    private foldersService: FoldersService
  ) {}

  ngOnInit(): void {}

  public editFolder(event: number): void {
    console.log(event);
  }

  public viewTasks(event: boolean) {
    console.log(event);
  }

  public deleteFolder(folderId: number) {
    Swal.fire({
      title: 'Are you sure you want to delete the folder?',

      showDenyButton: true,
      confirmButtonText: 'Yes, proceed',
      denyButtonText: `No!!`,
    }).then((result) => {
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
