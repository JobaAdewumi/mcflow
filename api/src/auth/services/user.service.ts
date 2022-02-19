import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { from, map, Observable, of, switchMap, tap } from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';

import { AuthService } from './auth.service';
import { WalletService } from './wallet.service';

import { PackageName } from './../models/package.enum';
import { UpdatedUser } from '../models/updated-user.class';
import { User } from '../models/user.class';
import { UserEntity } from '../models/user.entity';
import { WalletEntity } from '../models/wallet.entity';
import { Wallet } from '../models/wallet.interface';

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
  balance: number;
  userPackage: PackageName;

  doesUserExistWallet(userName: string): Observable<boolean> {
    return from(this.walletRepository.findOne({ userName })).pipe(
      switchMap((wallet: Wallet) => of(!!wallet)),
    );
  }

  loginMcf(
    userName: string,
    userPackage: PackageName,
    lastLogin: Date,
    points: number,
  ) {
    try {
      console.log(`${lastLogin}`, `${userName}`, `${userPackage}`);
      const rawTime = new Date(lastLogin);
      const day = rawTime.getDate();
      const dateNow = new Date();
      let rawDayNow = dateNow.getDate() - 1;
      // const timeNow = 23 - rawTimeNow;
      let mcfPoints = points;
      console.log(day, rawTime, rawDayNow);
      console.log('beg fu', points);

      // if (this.doesUserExistWallet) {
      //   throw new HttpException(
      //     'A wallet cannot be found connected with the user',
      //     HttpStatus.NOT_FOUND,
      //   );
      // }

      if (userPackage == 'bronze' && day > rawDayNow) {
        console.log('heere');
        mcfPoints = mcfPoints + 100;
        rawDayNow = rawDayNow + 1;
        console.log(rawDayNow);
        return from(
          this.walletRepository.update({ userName }, { mcfPoints: mcfPoints }),
        );
      } else if (userPackage == 'silver' && day > rawDayNow) {
        mcfPoints = mcfPoints + 300;
        rawDayNow = rawDayNow + 1;
        return from(
          this.walletRepository.update({ userName }, { mcfPoints: mcfPoints }),
        );
      } else if (userPackage == 'gold' && day > rawDayNow) {
        mcfPoints = mcfPoints + 500;
        rawDayNow = rawDayNow + 1;
        return from(
          this.walletRepository.update({ userName }, { mcfPoints: mcfPoints }),
        );
      } else if (userPackage == 'pioneer' && day > rawDayNow) {
        mcfPoints = mcfPoints + 1300;
        rawDayNow = rawDayNow + 1;
        return from(
          this.walletRepository.update({ userName }, { mcfPoints: mcfPoints }),
        );
      }
      console.log('end fu', mcfPoints);
      return null;
    } catch (err) {
      console.log(`${err}`);
      throw new Error(err);
    }
  }

  getLastLogin(id: number): Observable<Date> {
    return from(this.userRepository.findOne({ id })).pipe(
      map((user: User) => {
        delete user.password;
        return user.lastLogin;
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

  updateUserImageById(id: number, imagePath: string): Observable<UpdateResult> {
    console.log('return', imagePath);
    const user: User = new UserEntity();
    user.id = id;
    user.imagePath = imagePath;
    return from(this.userRepository.update(id, user));
  }

  findImageNameByUserId(id: number): Observable<string> {
    console.log('image-name-service', id);
    return from(this.userRepository.findOne({ id })).pipe(
      map((user: User) => {
        delete user.password;
        console.log('image-name--return-service', user.imagePath);
        return user.imagePath;
      }),
    );
  }
}
