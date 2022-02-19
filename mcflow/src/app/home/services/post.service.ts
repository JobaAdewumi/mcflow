import { NewSponsoredPost } from './../models/newPost.model';
import { ErrorHandlerService } from './../../core/services/error-handler.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, take, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SponsoredPost } from '../models/post';
import { BehaviorSubject, Observable } from 'rxjs';

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
