import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoldersComponent } from './folders/folders.component';
import { TasksComponent } from './tasks/tasks.component';
import { NoFoldersComponent } from './no-folders/no-folders.component';
import { NoTasksComponent } from './no-tasks/no-tasks.component';

@NgModule({
  declarations: [FoldersComponent, TasksComponent, NoFoldersComponent, NoTasksComponent],
  exports: [FoldersComponent, TasksComponent, NoFoldersComponent, NoTasksComponent],
  imports: [CommonModule],
})
export class ComponentsModule {}
