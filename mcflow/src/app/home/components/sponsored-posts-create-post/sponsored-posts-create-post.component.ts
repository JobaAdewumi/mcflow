import { NewSponsoredPost } from './../../models/newPost.model';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-sponsored-posts-create-post',
  templateUrl: './sponsored-posts-create-post.component.html',
  styleUrls: ['./sponsored-posts-create-post.component.scss'],
})
export class SponsoredPostsCreatePostComponent implements OnInit {
  @ViewChild('form') form: NgForm;

  @Input() postId?: number;

  constructor(
    private postService: PostService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    const { body, link } = this.form.value;
    if (!body || !link) return null;
    const newSponsoredPost: NewSponsoredPost = {
      body,
      link,
    };
    return this.postService
      .createPost(newSponsoredPost)
      .pipe(
        catchError((err) => {
          this.errorHandlerService.openSnackBar('post could not be created');
          console.log('error:', err);
          return throwError(err);
        })
      )
      .subscribe(
        // res =>
        //   this.errorHandlerService.openSuccessSnackBar(`Login res successfully: ${res}`),
        // err =>
        //   this.errorHandlerService.handleError(
        //     `wrong email or password: ${err}`,
        //   ),
        () => {
          this.errorHandlerService.openSuccessSnackBar(
            'post created successfully'
          );
        }
      );
  }
}
