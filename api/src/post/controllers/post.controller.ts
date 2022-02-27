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
import { saveImageToStorage, savePostImageToStorage } from '../../auth/helpers/image-storage';
import { SponsoredPost } from '../models/post.interface';
import { join } from 'path';
import { PostService } from '../services/post.service';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../models/role.enum';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  // @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('create')
  createPost(@Body() sponsoredPost: SponsoredPost): Observable<SponsoredPost> {
    return this.postService.createPost(sponsoredPost);
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

  // @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() sponsoredPost: SponsoredPost,
  ): Observable<UpdateResult> {
    return this.postService.updatePost(id, sponsoredPost);
  }

  // @Roles(Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Delete(':id')
  delete(@Param('id') id: number): Observable<DeleteResult> {
    return this.postService.deletePost(id);
  }

  // @UseGuards(JwtGuard, RolesGuard)
  // @Post('upload-image')
  // @UseInterceptors(FileInterceptor('file', savePostImageToStorage))
  // uploadImage(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() postId: number,
  // ): Observable<{ modifiedFileName: string } | { error: string }> {
  //   console.log('saving', file.filename);
  //   const fileName = file?.filename;

  //   if (!fileName) return of({ error: 'File must be a png, jpg/jpeg' });

  //   const imagesFolderPath = join(process.cwd(), 'post_images');
  //   console.log('before return controller', imagesFolderPath);
  //   const fullImagePath = join(imagesFolderPath + '/' + file.filename);

  //   console.log('before return controller', fileName);
  //   // const userId = req.user.id;

  //   return this.postService.updatePostImageById(postId, fileName).pipe(
  //     map(() => ({
  //       modifiedFileName: file.filename,
  //     })),
  //   );
  // }
  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', savePostImageToStorage))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Observable<{ modifiedFileName: string } | { error: string }> {
    console.log('saving', file.filename);
    console.log('req', req);
    const fileName = file?.filename;

    if (!fileName) return of({ error: 'File must be a png, jpg/jpeg' });

    const imagesFolderPath = join(process.cwd(), 'post_images');
    console.log('before return controller', imagesFolderPath);
    const fullImagePath = join(imagesFolderPath + '/' + file.filename);

    console.log('before return controller', fileName);
    const postId = req.postId;

    return this.postService.updatePostImageById(postId, fileName).pipe(
      map(() => ({
        modifiedFileName: file.filename,
      })),
    );
  }

  @UseGuards(JwtGuard)
  @Get('image')
  findImage(@Body() postId: number, @Res() res): Observable<Object> {
    // const userId = req.user.id;
    return this.postService.findImageNameByPostId(postId).pipe(
      switchMap((imageName: string) => {
        return of(res.sendFile(imageName, { root: './post_images' }));
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
    return res.sendFile(fileName, { root: './post_images' });
  }
}
