import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoldersComponent } from './folders/folders.component';
import { TasksComponent } from './tasks/tasks.component';

@NgModule({
  declarations: [FoldersComponent, TasksComponent],
  exports: [FoldersComponent, TasksComponent],
  imports: [CommonModule],
})
export class ComponentsModule {}
