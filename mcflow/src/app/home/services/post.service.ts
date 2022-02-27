import { NewSponsoredPost } from './../models/newPost.model';
import { ErrorHandlerService } from './../../core/services/error-handler.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SponsoredPost } from '../models/post';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) {}

  private post$ = new BehaviorSubject<SponsoredPost>(null);

  get postStream(): Observable<SponsoredPost> {
    return this.post$.asObservable();
  }

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  get postFullImagePath(): Observable<string> {
    return this.post$.asObservable().pipe(
      switchMap((post: SponsoredPost) => {
        const doesAuthorHaveImage = !!post?.postImagePath;
        let fullImagePath = this.getDefaultFullImagePath();
        if (doesAuthorHaveImage) {
          fullImagePath = this.getFullImagePath(post.postImagePath);
        }
        return of(fullImagePath);
      })
    );
  }

  getDefaultFullImagePath(): string {
    return `http://localhost:3000/api/post/image/blank-post-picture.jpg`;
  }

  getFullImagePath(imageName: string): string {
    return `http://localhost:3000/api/post/image/` + imageName;
  }

  getPostImage() {
    return this.http.get(`${environment.baseApiUrl}/user/image`).pipe(take(1));
  }

  getPostImageName(): Observable<{ imageName: string }> {
    return this.http
      .get<{ imageName: string }>(`${environment.baseApiUrl}/image/image-name`)
      .pipe(take(1));
  }

  updatePostImagePath(imagePath: string): Observable<SponsoredPost> {
    return this.post$.pipe(
      take(1),
      map((post: SponsoredPost) => {
        post.postImagePath = imagePath;
        this.post$.next(post);
        return post;
      })
    );
  }

  uploadPostImage(
    formData: FormData,
    postId: number
  ): Observable<{ modifiedFileName: string }> {
    console.log(formData, postId);
    return this.http
      .post<{ modifiedFileName: string }>(
        `${environment.baseApiUrl}/post/upload`,
        { formData, postId }
      )
      .pipe(
        tap(({ modifiedFileName }) => {
          let post = this.post$.value;
          post.postImagePath = modifiedFileName;
          this.post$.next(post);
        })
      );
  }

  getSelectedPost(params) {
    return this.http
      .get<SponsoredPost[]>(`${environment.baseApiUrl}/post${params}`)
      .pipe(
        tap((sponsoredPosts: SponsoredPost[]) => {
          if (sponsoredPosts.length === 0)
            throw new Error('No posts to retrieve');
        }),
        catchError(
          this.errorHandlerService.handleError<SponsoredPost[]>(
            'getSelectedPost',
            []
          )
        )
      );
  }

  createPost(newSponsoredPost: NewSponsoredPost) {
    return this.http
      .post<SponsoredPost>(
        `${environment.baseApiUrl}/post/create`,
        newSponsoredPost,
        this.httpOptions
      )
      .pipe(take(1));
  }

  updatePost(postId: number, newSponsoredPost: NewSponsoredPost) {
    return this.http
      .put(
        `${environment.baseApiUrl}/post/${postId}`,
        newSponsoredPost,
        this.httpOptions
      )
      .pipe(take(1));
  }

  deletePost(postId: number) {
    return this.http
      .delete(`${environment.baseApiUrl}/post/${postId}`)
      .pipe(take(1));
  }
}
