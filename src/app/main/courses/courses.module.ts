import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesPageComponent } from './components/courses-page/courses-page.component';
import { CourseItemComponent } from './components/course-item/course-item.component';
import { CourseControlButtonsComponent } from './components/course-control-buttons/course-control-buttons.component';
import { CoursesSearchComponent } from './components/courses-search/courses-search.component';
import { CourseViewDirective } from 'src/app/directives/course-view.directive';
import { DurationPipe } from 'src/app/pipes/duration.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderByPipe } from 'src/app/pipes/order-by.pipe';


@NgModule({
  declarations: [
    CoursesPageComponent,
    CourseItemComponent,
    CourseControlButtonsComponent,
    CoursesSearchComponent,
    CourseViewDirective,
    DurationPipe,
    OrderByPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [CoursesPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CoursesModule { }
