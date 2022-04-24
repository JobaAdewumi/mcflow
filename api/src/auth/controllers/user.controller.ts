import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
  UploadedFile,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';

import { join } from 'path';
import { map, Observable, of, switchMap } from 'rxjs';
import { UpdateResult } from 'typeorm';

import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { WalletService } from '../services/wallet.service';

import { UpdatedUser } from '../models/updated-user.class';
import { User } from '../models/user.class';
import { ContactUs } from '../models/contact-us.interface';
import { MailService } from '../../mails/services/mail.service';
import { FileInterceptor } from '@nestjs/platform-express';
// import { saveImageToStorage } from '../helpers/image-storage';
import { JwtGuard } from '../guards/jwt.guard';
import { S3 } from 'aws-sdk';

@Controller('user')
export class UserController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private mailService: MailService,
  ) {}

  @UseGuards(JwtGuard)
  @Put('login/mcf')
  loginMcf(
    @Body() { userName, userPackage, lastLogin, points },
  ): Observable<UpdateResult> {
    return this.userService.loginMcf(userName, userPackage, lastLogin, points);
  }

  @UseGuards(JwtGuard)
  @Put('share/mcf')
  shareMcf(
    @Body() { userName, userPackage, lastSharedLogin, points },
  ): Observable<UpdateResult> {
    return this.userService.shareMcf(
      userName,
      userPackage,
      lastSharedLogin,
      points,
    );
  }

  @Put('referral')
  referral(
    @Body() { userName, userPackage, ref, refB },
  ): Observable<UpdateResult> {
    return this.userService.referral(userName, userPackage, ref, refB);
  }

  // @UseGuards(JwtGuard)
  @Get('last-login/:id')
  LastLogin(
    @Param('id') stringId: string,
  ): Observable<{ lastLogin: Date | null }> {
    const id = parseInt(stringId);
    return this.userService.getLastLogin(id).pipe(
      switchMap((lastLogin: Date) => {
        return of({ lastLogin });
      }),
    );
  }

  @Get('last-shared-login/:id')
  LastSharedLogin(
    @Param('id') stringId: string,
  ): Observable<{ lastSharedLogin: Date | null }> {
    const id = parseInt(stringId);
    return this.userService.getLastSharedLogin(id).pipe(
      switchMap((lastSharedLogin: Date) => {
        return of({ lastSharedLogin });
      }),
    );
  }

  // @UseGuards(JwtGuard)
  @Get(':userName')
  getUser(@Param('userName') userName: string): Observable<User> {
    return this.userService.getUser(userName);
  }

  // @UseGuards(JwtGuard)
  @Get('login/:email')
  getLoginUser(@Param('email') email: string): Observable<User> {
    return this.userService.getLoginUser(email);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updatedUser: UpdatedUser,
  ): Observable<UpdateResult> {
    return this.authService.updateUser(id, updatedUser);
  }

  @Put('package/:userName')
  updateUserPackage(
    @Param('userName') userName: string,
    @Body() { userPackage },
  ): Observable<UpdateResult> {
    return this.userService.updatePackage(userName, userPackage);
  }

  @Post('contact')
  requestWithdrawal(@Body() contactUs: ContactUs) {
    return this.mailService.sendContactUsInfo(contactUs);
  }

  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<Observable<{ modifiedFileName: string } | { error: string }>> {
    const fileName = file?.filename;
    console.log(
      '🚀 ~ file: user.controller.ts ~ line 135 ~ UserController ~ fileName',
      fileName,
    );

    // if (!fileName) return of({ error: 'File must be a png, jpg/jpeg' });

    const imagesFolderPath = join(process.cwd(), 'images');
    const fullImagePath = join(imagesFolderPath + '/' + file.filename);

    const userId = req.user.id;
    console.log(
      '🚀 ~ file: user.controller.ts ~ line 143 ~ UserController ~ userId',
      userId,
    );

    return (
      await this.userService.updateUserImageById(
        userId,
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
  // @UseInterceptors(FileInterceptor('file', saveImageToStorage))
  // uploadImage(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Request() req,
  // ): Observable<{ modifiedFileName: string } | { error: string }> {
  //   const fileName = file?.filename;

  //   if (!fileName) return of({ error: 'File must be a png, jpg/jpeg' });

  //   const imagesFolderPath = join(process.cwd(), 'images');
  //   const fullImagePath = join(imagesFolderPath + '/' + file.filename);

  //   const userId = req.user.id;

  //   return this.userService.updateUserImageById(userId, fileName).pipe(
  //     map(() => ({
  //       modifiedFileName: file.filename,
  //     })),
  //   );
  // }

  @UseGuards(JwtGuard)
  @Get('image')
  findImage(@Request() req, @Res() res): Observable<Object> {
    const userId = req.user.id;
    const s3 = new S3();
    return this.userService.findImageNameByUserId(userId).pipe(
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
  // @UseGuards(JwtGuard)
  // @Get('image')
  // findImage(@Request() req, @Res() res): Observable<Object> {
  //   const userId = req.user.id;
  //   return this.userService.findImageNameByUserId(userId).pipe(
  //     switchMap((imageName: string) => {
  //       return of(res.sendFile(imageName, { root: './images' }));
  //     }),
  //   );
  // }

  @UseGuards(JwtGuard)
  @Get('images/image-name')
  findUserImageName(@Request() req): Observable<{ imageName: string }> {
    const userId = req.user.id;
    return this.userService.findImageNameByUserId(userId).pipe(
      switchMap((imageName: string) => {
        return of({ imageName });
      }),
    );
  }

  // @UseGuards(JwtGuard)
  @Get('image/:fileName')
  findImageByName(@Param('fileName') fileName: string, @Res() res) {
    console.log(
      '🚀 ~ file: user.controller.ts ~ line 234 ~ UserController ~ findImageByName ~ fileName',
      fileName,
    );
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
  // @Get('image/:fileName')
  // findImageByName(@Param('fileName') fileName: string, @Res() res) {
  //   return res.sendFile(fileName, { root: './images' });
  // }
}
