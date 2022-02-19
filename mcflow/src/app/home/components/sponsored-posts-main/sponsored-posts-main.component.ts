import { PostService } from './../../../../../../api/src/post/services/post.service';
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NewSponsoredPost } from '../../models/newPost.model';
import { SponsoredPost } from '../../models/post';

@Component({
  selector: 'app-sponsored-posts-main',
  templateUrl: './sponsored-posts-main.component.html',
  styleUrls: ['./sponsored-posts-main.component.scss']
})
export class SponsoredPostsMainComponent implements OnInit {
  @Input() postBody?: NewSponsoredPost;

  queryParams: string;
  allLoadedPosts: SponsoredPost[] = [];
  numberOfPosts = 5;
  slipPosts = 0;

  post$ = new BehaviorSubject<SponsoredPost>(null);

  postFullImagePath: string;
  private postSubscription: Subscription;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
  }

  getPosts

}
