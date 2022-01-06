import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';
import { Folder } from 'src/app/interfaces/folder.interface';
import { FoldersService } from '../../services/folders.service';
import { Subject, takeUntil } from 'rxjs';
import { unknownErrorAlert } from 'src/app/helpers/alerts';
import { noConectionAlert } from '../../helpers/alerts';
import {
  CreateFolderRequest,
  EditFolderRequest,
} from '../../interfaces/folder.interface';
import Swal from 'sweetalert2';
import { TodosService } from '../../services/todos.service';
import {
  CreateOrEditTodoReq,
  CreateTodoResponse,
  DeleteTodoResponseData,
  EditTodoResponse,
  Todo,
} from '../../interfaces/todos.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnDestroy {
  public viewingTodos: boolean = false;
  public folderToInspect: Folder;
  public todos: Todo[] = [];
  private destroy$: Subject<boolean> = new Subject();
  public get user(): User {
    return this.authService.getUser();
  }

  constructor(
    private authService: AuthService,
    private foldersService: FoldersService,
    private todosService: TodosService
  ) {}

  /** -------------------------------- FOLDERS ----------------------------------------------------- */

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
        } else if (value.length < 3) {
          return 'Name must have at lease 3 characters';
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
        if (result.isConfirmed) {
          const folder: Folder = this.user.Folders.find(
            (f) => f.id === folderId
          );

          folder.Todos.length
            ? this.deleteFolderAndTasksFromDatabase(folderId)
            : this.deleteFolderFromDatabase(folderId);
        }
      });
  }

  private deleteFolderFromDatabase(folderId: number): void {
    this.foldersService
      .deleteFolder(folderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          res?.meta?.status === 200
            ? this.rearrangeFolderArray(folderId)
            : unknownErrorAlert();
        },
        error: () => noConectionAlert(),
      });
  }

  private deleteFolderAndTasksFromDatabase(folderId: number): void {
    this.foldersService
      .deleteFolderWithTasks(folderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          res?.meta?.status === 200
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

  public viewTasks(folderID: number) {
    this.folderToInspect = this.user.Folders.find(
      (folder) => folder.id === folderID
    );
    !this.folderToInspect.Todos ? (this.folderToInspect.Todos = []) : null;
    this.viewingTodos = true;
  }

  /** -------------------------------- END FOLDERS ------------------------------------------------ */

  /** -------------------------------- TODOS ------------------------------------------------------ */

  public createNewTask(name: string) {
    const object: CreateOrEditTodoReq = {
      name,
      completed: false,
    };

    this.todosService
      .createTodo(this.user.id, this.folderToInspect.id, object)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: CreateTodoResponse) => {
          res?.meta?.status === 200
            ? this.setUserWithNewTodo(res?.data?.todo)
            : unknownErrorAlert();
        },
        error: (err) => noConectionAlert(),
      });
  }

  private setUserWithNewTodo(todo: Todo): void {
    const newTodos = [...this.user.Todos, todo];
    const u: User = new User(
      this.user.id,
      this.user.email,
      this.user.created_at,
      this.user.updated_at,
      this.user.Folders,
      newTodos
    );
    this.authService.setUser(u);
    u === this.authService.getUser()
      ? this.folderToInspect.Todos.push(todo)
      : unknownErrorAlert();
  }

  public async editTodo(todoData: [number, string]): Promise<void> {
    const [todoId, oldTodoName] = [todoData[0], todoData[1]];

    const inputValue: string = oldTodoName;

    const { value: newTodoName } = await Swal.fire({
      title: 'Enter the name of the todo',
      input: 'text',
      inputLabel: 'Todo name',
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
        } else if (value.length < 3) {
          return 'Name must have at lease 3 characters';
        }
      },
    });

    if (newTodoName) {
      this.editTodoNameInDatabase(todoId, newTodoName);
    }
  }

  private editTodoNameInDatabase(todoId: number, valueToEdit: string): void {
    const form: CreateOrEditTodoReq = {
      name: valueToEdit,
      completed: this.folderToInspect.Todos?.find((todo) => (todo.id = todoId))
        .completed,
    };
    this.todosService
      .editTodo(todoId, form)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: EditTodoResponse) => {
          res?.meta?.status === 200
            ? this.correctTodoArray(res?.data?.todo)
            : unknownErrorAlert();
        },
        error: (err) => noConectionAlert(),
      });
  }

  public editTodoStatusInDatabase(todoData: [number, boolean]): void {
    const [todoId, status] = [todoData[0], todoData[1]];
    const form: CreateOrEditTodoReq = {
      name: this.folderToInspect.Todos?.find((todo) => (todo.id = todoId)).name,
      completed: status,
    };

    this.todosService
      .editTodo(todoId, form)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: EditTodoResponse) =>
          res?.meta?.status === 200 ? null : unknownErrorAlert(),
        error: (err) => noConectionAlert(),
      });
  }

  private correctTodoArray(todo: Todo): void {
    // Cant make it work
    const index: number = this.user.Todos.findIndex(
      (t: Todo) => t.id === todo.id
    );
    this.user.Todos[index] = todo;
    this.folderToInspect.Todos[index] = todo;
  }

  public deleteTodo(todoId: number): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-primary',
        denyButton: 'btn btn-danger',
      },
      buttonsStyling: true,
    });
    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure you want to delete the task?',
        showDenyButton: true,
        confirmButtonText: 'Yes, proceed',
        denyButtonText: `No!!`,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.deleteTodoFromDatabase(todoId);
        }
      });
  }

  private deleteTodoFromDatabase(todoId: number): void {
    this.todosService
      .deleteTodo(todoId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: DeleteTodoResponseData) => {
          res?.meta?.status === 200
            ? this.rearrangeTodoArray(todoId)
            : unknownErrorAlert();
        },
        error: () => noConectionAlert(),
      });
  }

  private rearrangeTodoArray(todoId: number) {
    const newTodosArray: Todo[] = this.folderToInspect.Todos?.filter(
      (todo: Todo) => todo.id !== todoId
    );

    const u: User = new User(
      this.user.id,
      this.user.email,
      this.user.created_at,
      this.user.updated_at,
      this.user.Folders,
      newTodosArray
    );

    this.authService.setUser(u);
    if (this.authService.getUser() === u) {
      this.folderToInspect.Todos = newTodosArray;
    }
  }

  public showFolders(): void {
    this.viewingTodos = false;
    this.folderToInspect = null;
  }

  /** -------------------------------- END TODOS -------------------------------------------------- */

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
