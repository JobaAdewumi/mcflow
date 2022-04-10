import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable } from 'rxjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from '../../auth/models/user.class';
import { SponsoredPostEntity } from '../models/post.entity';
import { SponsoredPost } from '../models/post.interface';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(SponsoredPostEntity)
    private readonly sponsoredPostRepository: Repository<SponsoredPostEntity>,
  ) {}

  createPost(
    user: User,
    sponsoredPost: SponsoredPost,
  ): Observable<SponsoredPost> {
    sponsoredPost.author = user;
    return from(this.sponsoredPostRepository.save(sponsoredPost));
  }

  findAllPosts(): Observable<SponsoredPost[]> {
    return from(this.sponsoredPostRepository.find());
  }

  findPosts(take: number = 10, skip: number = 0): Observable<SponsoredPost[]> {
    return from(
      this.sponsoredPostRepository
        .createQueryBuilder('post')
        .orderBy('post.createdAt', 'DESC')
        .take(take)
        .skip(skip)
        .getMany(),
    );
  }

  updatePost(
    id: number,
    sponsoredPost: SponsoredPost,
  ): Observable<UpdateResult> {
    return from(this.sponsoredPostRepository.update(id, sponsoredPost));
  }

  deletePost(id: number): Observable<DeleteResult> {
    return from(this.sponsoredPostRepository.delete(id));
  }

  findPostById(id: number): Observable<SponsoredPost> {
    return from(this.sponsoredPostRepository.findOne(id));
  }

  changePostStatus(id: number): Observable<UpdateResult> {
    return from(this.sponsoredPostRepository.update(id, { isActive: false }));
  }

  updatePostImageById(
    id: number,
    postImagePath: string,
  ): Observable<UpdateResult> {
    console.log('return', postImagePath);
    const sponsoredPost: SponsoredPost = new SponsoredPostEntity();
    sponsoredPost.id = id;
    sponsoredPost.postImagePath = postImagePath;
    return from(this.sponsoredPostRepository.update(id, sponsoredPost));
  }

  findImageNameByPostId(id: number): Observable<string> {
    console.log('image-name-service', id);
    return from(this.sponsoredPostRepository.findOne({ id })).pipe(
      map((sponsoredPost: SponsoredPost) => {
        console.log('image-name--return-service', sponsoredPost.postImagePath);
        return sponsoredPost.postImagePath;
      }),
    );
  }
}
