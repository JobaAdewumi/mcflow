import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { from, map, Observable, of, switchMap, tap } from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';

import { AuthService } from './auth.service';
import { WalletService } from './wallet.service';

import { UserPackage } from './../models/package.enum';
import { UpdatedUser } from '../models/updated-user.class';
import { User } from '../models/user.class';
import { UserEntity } from '../models/user.entity';
import { WalletEntity } from '../models/wallet.entity';
import { Wallet } from '../models/wallet.interface';
import { S3 } from 'aws-sdk';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
    private authService: AuthService,
  ) {}

  mcfPoints: number;
  referralBalance: number;
  userPackage: UserPackage;

  doesUserExistWallet(userName: string): Observable<boolean> {
    return from(this.walletRepository.findOne({ userName })).pipe(
      switchMap((wallet: Wallet) => of(!!wallet)),
    );
  }

  loginMcf(
    userName: string,
    userPackage: UserPackage,
    lastLogin: Date,
    points: number,
  ) {
    try {
      let mcfPoints = points;

      if (userPackage === 'bronze') {
        mcfPoints = mcfPoints + 100;
      } else if (userPackage === 'silver') {
        mcfPoints = mcfPoints + 300;
      } else if (userPackage === 'gold') {
        mcfPoints = mcfPoints + 500;
      } else if (userPackage === 'pioneer') {
        mcfPoints = mcfPoints + 1300;
      }
      return from(
        this.walletRepository.update({ userName }, { mcfPoints: mcfPoints }),
      );
    } catch (err) {
      throw new HttpException('An Error sending email', HttpStatus.BAD_REQUEST);
    }
  }

  shareMcf(
    userName: string,
    userPackage: string,
    lastLogin: Date,
    points: number,
  ) {
    try {
      let mcfPoints = points;

      if (userPackage === 'bronze') {
        mcfPoints = mcfPoints + 200;
      } else if (userPackage === 'silver') {
        mcfPoints = mcfPoints + 500;
      } else if (userPackage === 'gold') {
        mcfPoints = mcfPoints + 1000;
      } else if (userPackage === 'pioneer') {
        mcfPoints = mcfPoints + 2200;
      }
      return from(
        this.walletRepository.update({ userName }, { mcfPoints: mcfPoints }),
      );
    } catch (err) {
      throw new HttpException('An Error sending email', HttpStatus.BAD_REQUEST);
    }
  }

  referral(
    userName: string,
    userPackage: UserPackage,
    ref: number,
    refB: number,
  ): Observable<UpdateResult> {
    try {
      let referral = refB;
      let noReferred = ref;

      if (userPackage == 'bronze') {
        referral = referral + 1000;
        noReferred = noReferred + 1;
        return from(
          this.walletRepository.update(
            { userName },
            { referralBalance: referral, referred: noReferred },
          ),
        );
      } else if (userPackage == 'silver') {
        referral = referral + 2500;
        noReferred = noReferred + 1;
        return from(
          this.walletRepository.update(
            { userName },
            { referralBalance: referral, referred: noReferred },
          ),
        );
      } else if (userPackage == 'gold') {
        referral = referral + 4000;
        noReferred = noReferred + 1;
        return from(
          this.walletRepository.update(
            { userName },
            { referralBalance: referral, referred: noReferred },
          ),
        );
      } else if (userPackage == 'pioneer') {
        referral = referral + 8000;
        noReferred = noReferred + 1;
        return from(
          this.walletRepository.update(
            { userName },
            { referralBalance: referral, referred: noReferred },
          ),
        );
      }
      return null;
    } catch (err) {
      throw new HttpException('An Error sending email', HttpStatus.BAD_REQUEST);
    }
  }

  getLastLogin(id: number): Observable<Date> | null {
    return from(this.userRepository.findOne({ id })).pipe(
      map((user: User) => {
        delete user.password;
        return user.lastLogin;
      }),
    );
  }

  getLastSharedLogin(id: number): Observable<Date> | null {
    return from(this.userRepository.findOne({ id })).pipe(
      map((user: User) => {
        delete user.password;
        return user.lastSharedLogin;
      }),
    );
  }

  getUser(userName: string): Observable<User> {
    return from(this.userRepository.findOne({ userName })).pipe(
      map((user: User) => {
        delete user.password;
        return user;
      }),
    );
  }

  getLoginUser(email: string): Observable<User> {
    return from(this.userRepository.findOne({ email })).pipe(
      map((user: User) => {
        delete user.password;
        return user;
      }),
    );
  }

  async uploadPublicFile(id: number, dataBuffer: Buffer, originalName: string) {
    const s3 = new S3();
    console.log(
      '🚀 ~ file: user.service.ts ~ line 184 ~ UserService ~ uploadPublicFile ~ s3',
      s3,
    );
    const fileExtension: string = path.extname(originalName);
    console.log(
      '🚀 ~ file: user.service.ts ~ line 185 ~ UserService ~ uploadPublicFile ~ fileExtension',
      fileExtension,
    );
    const fileName: string = `user/` + uuidv4() + fileExtension;
    console.log(
      '🚀 ~ file: user.service.ts ~ line 186 ~ UserService ~ uploadPublicFile ~ fileName',
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
    const user: User = new UserEntity();
    user.id = id;
    user.imagePath = uploadResult.Key;
    console.log(
      '🚀 ~ file: user.service.ts ~ line 200 ~ UserService ~ uploadPublicFile ~ user.imagePath',
      user.imagePath,
    );
    return from(this.userRepository.update(id, user));
  }

  updateUserImageById(id: number, fileBuffer: Buffer, originalName: string) {
    console.log(
      '🚀 ~ file: user.service.ts ~ line 201 ~ UserService ~ updateUserImageById ~ fileBuffer',
      fileBuffer,
    );
    console.log(
      '🚀 ~ file: user.service.ts ~ line 201 ~ UserService ~ updateUserImageById ~ id',
      id,
    );
    return this.uploadPublicFile(id, fileBuffer, originalName);
  }

  // updateUserImageById(id: number, imagePath: string): Observable<UpdateResult> {
  //   const user: User = new UserEntity();
  //   user.id = id;
  //   user.imagePath = imagePath;
  //   return from(this.userRepository.update(id, user));
  // }

  findImageNameByUserId(id: number): Observable<string> {
    return from(this.userRepository.findOne({ id })).pipe(
      map((user: User) => {
        delete user.password;
        return user.imagePath;
      }),
    );
  }

  updatePackage(
    userName: string,
    userPackage: UserPackage,
  ): Observable<UpdateResult> {
    return from(
      this.userRepository.update({ userName }, { userPackage: userPackage }),
    );
  }
}
