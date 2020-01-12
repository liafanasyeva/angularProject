import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from 'src/app/services/course-service/courses.service';
import { tap } from 'rxjs/operators';
import { CourseModel } from 'src/app/domain/models/Course.model';
import { Course } from 'src/app/domain/interfaces/course.interface';
import { State, CourseState } from 'src/app/state';
import { Store, select } from '@ngrx/store';
import { getAllCourses, editCourse } from 'src/app/state/courses/courses.actions';
import { selectCourses } from 'src/app/state/courses/courses.selector';
@Component({
  selector: 'app-course-add-body',
  templateUrl: './course-add-body.component.html',
  styleUrls: ['./course-add-body.component.scss']
})
export class CourseAddBodyComponent implements OnInit, OnDestroy {

  manageCourse: string;
  newIndex: number;
  mode: string;
  description: string;
  title: string;
  idCourse: number;
  course: Course;
  unsubscribe: any;
  date: string | Date;

  constructor(
    public coursesService: CoursesService,
    private router: ActivatedRoute,
    private route: Router,
    private store: Store<State>,
  ) {
    this.unsubscribe = this.router.params.pipe(tap(data => data)).subscribe(data => {
      if (Number(data.id)) {
        this.idCourse = Number(data.id);
        this.mode = 'Edit';
        this.manageCourse = 'Edit course';
        return;
      }
      this.mode = 'Add';
      this.manageCourse = 'New course';
      return;
    });
  }

  ngOnInit() {
    if (this.mode === 'Edit') {
      this.getCourseItem();
      return;
    }
    this.createNewCourse();
  }

  createNewCourse() {
    this.store.dispatch(getAllCourses());
    this.store.pipe(select(selectCourses)).subscribe(data => {
      const coursesId = [...data.allCourses].map(item => Number(item.id)).sort((a, b) => a - b);
      this.newIndex = coursesId[coursesId.length - 1] + 1;
    });
    this.course = new CourseModel(this.newIndex, '', false, new Date(), 0, '', []);
    this.title = this.course.name;
    this.description = this.course.description;
    this.coursesService.currentCourse.emit('New course');
  }

  ngOnDestroy() {
    this.coursesService.currentCourse.emit();
    this.coursesService.currentCourse.complete();
    this.unsubscribe.unsubscribe();
  }

  getCourseItem() {
    this.store.dispatch(getAllCourses());
    this.store.dispatch(editCourse({currentId: this.idCourse}));
    this.store.pipe(
      select(selectCourses),
    ).subscribe((courses: CourseState) => {
      if (courses.currentCourse) {
        const currentCourse = courses.currentCourse;
        this.course = {...currentCourse};
        this.date = new Date(this.course.date);
        this.title = this.course.name;
        this.description = this.course.description;
        this.coursesService.currentCourse.emit(this.title);
      }
    });
  }

  onSave() {
    if (this.mode === 'Edit') {
      this.coursesService.updateItem(this.idCourse, this.course).subscribe(item => item);
    } else if (this.mode === 'Add') {
      this.coursesService.addCourse(this.course).subscribe(item => item);
    }
    this.route.navigateByUrl('/courses');
    console.log('Save course');
  }

  onCancel() {
    this.route.navigateByUrl('/courses');
    console.log('Close');
  }

  getNewDate(date) {
    this.course.date = date;
  }

  getNewDuration(duration: number) {
    this.course.length = duration;
  }

  getNewDescription() {
    this.course.description = this.description;
  }

  getNewTitle() {
    this.course.name = this.title;
  }
}
