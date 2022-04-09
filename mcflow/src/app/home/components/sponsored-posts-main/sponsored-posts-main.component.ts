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
import { HomeService } from '../../services/home.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-sponsored-posts-main',
  templateUrl: './sponsored-posts-main.component.html',
  styleUrls: ['./sponsored-posts-main.component.scss'],
})
export class SponsoredPostsMainComponent implements OnInit, OnDestroy {
  constructor(
    private postService: PostService,
    private authService: AuthService,
    private homeService: HomeService,
    private errorHandlerService: ErrorHandlerService
  ) {}
  form: FormGroup;
  @Input() postBody?: NewSponsoredPost;

  submissionType: 'free' | 'shared' = 'free';

  queryParams: string;
  allLoadedPosts: SponsoredPost[] = [];
  numberOfPosts = 5;
  skipPosts = 0;

  role: string;

  post$ = new BehaviorSubject<SponsoredPost>(null);
  user$ = new BehaviorSubject<User>(null);

  postFullImagePath: string;
  private postSubscription: Subscription;

  counter: number = 0;

  userName: string = this.homeService.userName;
  userPackage: string = this.homeService.userPackage;
  lastSharedLogin: Date = this.homeService.lastSharedLogin;
  points: number = this.homeService.points;

  userId: number;

  ngOnInit(): void {
    this.userName = this.homeService.userName;
    this.userPackage = this.homeService.userPackage;
    this.lastSharedLogin = this.homeService.lastSharedLogin;
    this.points = this.homeService.points;
    this.getPosts(true, event);

    // if (window.scrollTo(0,0)) {
    //   this.ge
    // }
    this.authService.userRole.pipe(take(1)).subscribe((role: string) => {
      this.role = role;
      console.log(role);
      this.user$.next(role as any);
    });

    this.authService.userId.pipe(take(1)).subscribe((userId: number) => {
      this.userId = userId;
      console.log(userId);
      this.user$.next(userId as any);
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
          this.errorHandlerService.openSnackBar('Error deleting post');
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

  changePostStatus(postId: number) {
    this.postService
      .changePostStatus(postId)
      .pipe(
        catchError((err) => {
          this.errorHandlerService.openSnackBar('Check your email or password');
          console.log('error:', err);
          return throwError(err);
        })
      )
      .subscribe(() => {
        this.errorHandlerService.openSuccessSnackBar(
          'Post status change successful'
        );
      });
  }

  onFileSelect(event: Event): void {
    const file: File = (event.target as HTMLInputElement).files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    this.postService
      .uploadPostImage(formData)
      .pipe(
        catchError((err) => {
          this.errorHandlerService.openSnackBar('Error uploading post picture');
          console.log('error:', err);
          return throwError(err);
        })
      )
      .subscribe(() => {
        this.errorHandlerService.openSuccessSnackBar(
          'Post picture updated successfully'
        );
      });

    // this.form.reset();
  }

  // startCountdown(seconds: number) {
  //   this.counter = seconds;

  //   const interval = setInterval(() => {
  //     console.log(this.counter);
  //     this.counter--;

  //     if (this.counter <= 0) {
  //       this.shareMcf();
  //       clearInterval(interval);
  //       console.log('Ding!');
  //     }
  //   }, 1000);
  // }

  shareMcf() {
    console.log(
      'going',
      this.lastSharedLogin,
      this.userName,
      this.points,
      this.userPackage
    );
    if (!this.lastSharedLogin || this.lastSharedLogin == null) {
      this.homeService.addSharedDate(this.userId).subscribe();
      console.log('compo');
      return null;
    }
    return this.homeService.shareCheckMcf(
      this.userName,
      this.userPackage,
      this.lastSharedLogin,
      this.points
    );
  }

  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
  }
}
