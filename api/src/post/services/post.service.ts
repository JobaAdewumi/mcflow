import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable } from 'rxjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from '../../auth/models/user.class';
import { SponsoredPostEntity } from '../models/post.entity';
import { SponsoredPost } from '../models/post.interface';
import { S3 } from 'aws-sdk';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';

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

  async uploadPublicFile(id: number, dataBuffer: Buffer, originalName: string) {
    const s3 = new S3();
    const fileExtension: string = path.extname(originalName);
    console.log(
      '🚀 ~ file: post.service.ts ~ line 64 ~ PostService ~ uploadPublicFile ~ fileExtension',
      fileExtension,
    );
    const fileName: string = `post/` + uuidv4() + fileExtension;
    console.log(
      '🚀 ~ file: post.service.ts ~ line 66 ~ PostService ~ uploadPublicFile ~ fileName',
      fileName,
    );

    const uploadResult = await s3
      .upload({
        ACL: 'public-read',
        Bucket: process.env.S3_BUCKET,
        Body: dataBuffer,
        Key: fileName,
      })
      .promise();
    const sponsoredPost: SponsoredPost = new SponsoredPostEntity();
    sponsoredPost.id = id;
    sponsoredPost.postImagePath = uploadResult.Key;
    console.log(
      '🚀 ~ file: post.service.ts ~ line 79 ~ PostService ~ uploadPublicFile ~ sponsoredPost.postImagePath',
      sponsoredPost.postImagePath,
    );

    return from(this.sponsoredPostRepository.update(id, sponsoredPost));
  }

  updatePostImageById(id: number, fileBuffer: Buffer, originalName: string) {
    return this.uploadPublicFile(id, fileBuffer, originalName);
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
