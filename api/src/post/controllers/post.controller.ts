import { map, Observable, of, switchMap } from 'rxjs';
import { RolesGuard } from './../guards/roles.guard';
import { JwtGuard } from './../../auth/guards/jwt.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { savePostImageToStorage } from '../../auth/helpers/image-storage';
import { SponsoredPost } from '../models/post.interface';
import { join } from 'path';
import { PostService } from '../services/post.service';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../models/role.enum';
import { DeleteResult, UpdateResult } from 'typeorm';
import { S3 } from 'aws-sdk';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  // @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('create')
  createPost(
    @Body() sponsoredPost: SponsoredPost,
    @Request() req,
  ): Observable<SponsoredPost> {
    return this.postService.createPost(req.user, sponsoredPost);
  }
  // @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Get()
  findSelected(
    @Query('take') take: number = 1,
    @Query('skip') skip: number = 1,
  ): Observable<SponsoredPost[]> {
    take = take > 20 ? 20 : take;
    return this.postService.findPosts(take, skip);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() sponsoredPost: SponsoredPost,
  ): Observable<UpdateResult> {
    return this.postService.updatePost(id, sponsoredPost);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  delete(@Param('id') id: number): Observable<DeleteResult> {
    return this.postService.deletePost(id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Put('status/:id')
  changePostStatus(@Param('id') id: number): Observable<UpdateResult> {
    return this.postService.changePostStatus(id);
  }

  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<Observable<{ modifiedFileName: string } | { error: string }>> {
    // console.log('saving', file.filename);
    // console.log('req', req);
    const fileName = file?.filename;

    const sponsoredPosts: [] = req.user.sponsoredPosts;
    // console.log('posts', JSON.stringify(sponsoredPosts));
    const postsString: any = JSON.stringify(sponsoredPosts);
    const posts = JSON.parse(postsString);
    // console.log('poststs', posts);

    // if (!fileName) return of({ error: 'File must be a png, jpg/jpeg' });

    const imagesFolderPath = join(process.cwd(), 'post_images');
    // console.log('before return controller', imagesFolderPath);
    const fullImagePath = join(imagesFolderPath + '/' + file.filename);

    // console.log('before return controller', fileName);
    const postId = posts[posts.length - 1].id;
    console.log(
      '🚀 ~ file: post.controller.ts ~ line 116 ~ PostController ~ postId',
      postId,
    );

    return (
      await this.postService.updatePostImageById(
        postId,
        file.buffer,
        file.originalname,
      )
    ).pipe(
      map(() => ({
        modifiedFileName: file.filename,
      })),
    );
  }
  // @UseGuards(JwtGuard)
  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file', savePostImageToStorage))
  // uploadImage(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Request() req,
  // ): Observable<{ modifiedFileName: string } | { error: string }> {
  //   console.log('saving', file.filename);
  //   console.log('req', req);
  //   const fileName = file?.filename;

  //   const sponsoredPosts: [] = req.user.sponsoredPosts;
  //   console.log('posts', JSON.stringify(sponsoredPosts));
  //   const postsString: any = JSON.stringify(sponsoredPosts);
  //   const posts = JSON.parse(postsString);
  //   console.log('poststs', posts);

  //   if (!fileName) return of({ error: 'File must be a png, jpg/jpeg' });

  //   const imagesFolderPath = join(process.cwd(), 'post_images');
  //   console.log('before return controller', imagesFolderPath);
  //   const fullImagePath = join(imagesFolderPath + '/' + file.filename);

  //   console.log('before return controller', fileName);
  //   const postId = posts[posts.length - 1].id;
  //   console.log(
  //     '🚀 ~ file: post.controller.ts ~ line 116 ~ PostController ~ postId',
  //     postId,
  //   );

  //   return this.postService.updatePostImageById(postId, fileName).pipe(
  //     map(() => ({
  //       modifiedFileName: file.filename,
  //     })),
  //   );
  // }
  // @UseGuards(JwtGuard)
  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file', savePostImageToStorage))
  // uploadImage(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Request() req,
  // ): Observable<{ modifiedFileName: string } | { error: string }> {
  //   console.log('saving', file.filename);
  //   console.log('req', req);
  //   const fileName = file?.filename;

  //   const sponsoredPosts: [] = req.sponsoredPosts;

  //   if (!fileName) return of({ error: 'File must be a png, jpg/jpeg' });

  //   const imagesFolderPath = join(process.cwd(), 'post_images');
  //   console.log('before return controller', imagesFolderPath);
  //   const fullImagePath = join(imagesFolderPath + '/' + file.filename);

  //   console.log('before return controller', fileName);
  //   const postId = req.sponsoredPosts[sponsoredPosts.length - 1].postId;
  //   console.log(
  //     '🚀 ~ file: post.controller.ts ~ line 116 ~ PostController ~ postId',
  //     postId,
  //   );

  //   return this.postService.updatePostImageById(postId, fileName).pipe(
  //     map(() => ({
  //       modifiedFileName: file.filename,
  //     })),
  //   );
  // }

  @UseGuards(JwtGuard)
  @Get('image')
  findImage(@Body() postId: number, @Res() res): Observable<Object> {
    // const userId = req.user.id;
    const s3 = new S3();
    return this.postService.findImageNameByPostId(postId).pipe(
      switchMap((imageName: string) => {
        const params = {
          Bucket: process.env.S3_BUCKET,
          Key: imageName,
        };
        return of(
          res.sendFile(
            s3.getObject(params, function (err, data) {
              // res.writeHead(200, { 'Content-Type': 'image/jpeg' });
              res.write(data.Body, 'binary');
              res.end(null, 'binary');
            }),
          ),
        );
      }),
    );
  }

  @UseGuards(JwtGuard)
  @Get('image-name')
  findUserImageName(@Body() postId: number): Observable<{ imageName: string }> {
    console.log('image-name-conn', postId);
    return this.postService.findImageNameByPostId(postId).pipe(
      switchMap((imageName: string) => {
        console.log('image-name-return-conn', imageName);
        return of({ imageName });
      }),
    );
  }

  // @UseGuards(JwtGuard)
  @Get('image/:fileName')
  findImageByName(@Param('fileName') fileName: string, @Res() res) {
    const s3 = new S3();
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
    };
    return res.sendFile(
      s3.getObject(params, function (err, data) {
        // res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        // res.write(data.Body, 'binary');
        res.end(null, 'binary');
      }),
    );
  }
}
