import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Subscription, throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { User } from '../../../auth/models/user.model';
import { AuthService } from '../../../auth/services/auth.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { NewSponsoredPost } from '../../models/newPost.model';
import { SponsoredPost } from '../../models/post';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-sponsored-posts-main',
  templateUrl: './sponsored-posts-main.component.html',
  styleUrls: ['./sponsored-posts-main.component.scss'],
})
export class SponsoredPostsMainComponent implements OnInit, OnDestroy {
  form: FormGroup;
  @Input() postBody?: NewSponsoredPost;

  queryParams: string;
  allLoadedPosts: SponsoredPost[] = [];
  numberOfPosts = 5;
  skipPosts = 0;

  role: string;

  post$ = new BehaviorSubject<SponsoredPost>(null);
  user$ = new BehaviorSubject<User>(null);

  postFullImagePath: string;
  private postSubscription: Subscription;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.getPosts(true, event);

    // if (window.scrollTo(0,0)) {
    //   this.ge
    // }
    this.authService.userRole.pipe(take(1)).subscribe((role: string) => {
      this.role = role;
      console.log(role);
      this.user$.next(role as any);
    });

    this.postSubscription = this.postService.postStream.subscribe(() => {
      this.allLoadedPosts.forEach((post: SponsoredPost, index: number) => {
        if (post?.postImagePath) {
          this.allLoadedPosts[index]['fullImagePath'] =
            this.postService.getFullImagePath(post.postImagePath);
        }
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    const postBody = changes.sponsoredPost.currentValue;
    if (!postBody) return;

    this.postService.createPost(postBody).subscribe((post: SponsoredPost) => {
      this.postService.postFullImagePath
        .pipe(take(1))
        .subscribe((fullImagePath: string) => {
          post['fullImagePath'] = fullImagePath;
          this.allLoadedPosts.unshift(post);
        });
    });
  }

  getPosts(isInitialLoad: boolean, event) {
    if (this.skipPosts === 20) {
      this.errorHandlerService.openSnackBar(
        'Posts cannot be retrieved at this time'
      );
      return null;
    }
    this.queryParams = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`;

    this.postService.getSelectedPost(this.queryParams).subscribe(
      (posts: SponsoredPost[]) => {
        for (let postIndex = 0; postIndex < posts.length; postIndex++) {
          const doesPostHaveImage = !!posts[postIndex].postImagePath;
          let fullImagePath = this.postService.getDefaultFullImagePath();
          if (doesPostHaveImage) {
            fullImagePath = this.postService.getFullImagePath(
              posts[postIndex].postImagePath
            );
          }
          posts[postIndex]['fullImagePath'] = fullImagePath;
          this.allLoadedPosts.push(posts[postIndex]);
        }
        // if (isInitialLoad) event.target.complete();
        this.skipPosts = this.skipPosts + 5;
      },
      (error) => {
        this.errorHandlerService.openSnackBar(
          'An error occurred trying to get the posts'
        );
        window.alert(error);
        console.log(error);
      },
      () => {
        this.errorHandlerService.openSuccessSnackBar(
          'Post retrieval successful'
        );
      }
    );
  }

  deletePost(postId: number) {
    this.postService
      .deletePost(postId)
      .pipe(
        catchError((err) => {
          this.errorHandlerService.openSnackBar('Check your email or password');
          console.log('error:', err);
          return throwError(err);
        })
      )
      .subscribe(() => {
        this.allLoadedPosts = this.allLoadedPosts.filter(
          (post: SponsoredPost) => post.id !== postId
        );
        this.errorHandlerService.openSuccessSnackBar('Deleted post successful');
      });
  }

  onFileSelect(event: Event, postId: number): void {
    const file: File = (event.target as HTMLInputElement).files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    this.postService
      .uploadPostImage(formData, postId)
      .pipe(
        catchError((err) => {
          this.errorHandlerService.openSnackBar('Check your email or password');
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
          this.errorHandlerService.openSuccessSnackBar('Profile picture updated successfully');
        }
      );

    this.form.reset();
  }

  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
  }
}
