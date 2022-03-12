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
      console.log(`${lastLogin}`, `${userName}`, `${userPackage}`);

      let mcfPoints = points;
      console.log('beg fu', points);

      if (userPackage === 'bronze') {
        console.log('heere');
        mcfPoints = mcfPoints + 100;
      } else if (userPackage === 'silver') {
        mcfPoints = mcfPoints + 300;
      } else if (userPackage === 'gold') {
        mcfPoints = mcfPoints + 500;
      } else if (userPackage === 'pioneer') {
        mcfPoints = mcfPoints + 1300;
        console.log('there');
      }
      console.log('end fu', mcfPoints);
      return from(
        this.walletRepository.update({ userName }, { mcfPoints: mcfPoints }),
      );
    } catch (err) {
      console.log(`${err}`);
      throw new Error(err);
    }
  }
  // loginMcf(
  //   userName: string,
  //   userPackage: UserPackage,
  //   lastLogin: Date,
  //   points: number,
  // ) {
  //   try {
  //     console.log(`${lastLogin}`, `${userName}`, `${userPackage}`);
  //     const rawTime = new Date(lastLogin);
  //     const day = rawTime.getDate();
  //     const dateNow = new Date();
  //     let rawDayNow = dateNow.getDate() - 1;
  //     // const timeNow = 23 - rawTimeNow;
  //     let mcfPoints = points;
  //     console.log(day, rawTime, rawDayNow);
  //     console.log('beg fu', points);

  //     // if (this.doesUserExistWallet) {
  //     //   throw new HttpException(
  //     //     'A wallet cannot be found connected with the user',
  //     //     HttpStatus.NOT_FOUND,
  //     //   );
  //     // }

  //     if (userPackage == 'bronze' && day > rawDayNow) {
  //       console.log('heere');
  //       mcfPoints = mcfPoints + 100;
  //       rawDayNow = rawDayNow + 1;
  //       console.log(rawDayNow);
  //       return from(
  //         this.walletRepository.update({ userName }, { mcfPoints: mcfPoints }),
  //       );
  //     } else if (userPackage == 'silver' && day > rawDayNow) {
  //       mcfPoints = mcfPoints + 300;
  //       rawDayNow = rawDayNow + 1;
  //       return from(
  //         this.walletRepository.update({ userName }, { mcfPoints: mcfPoints }),
  //       );
  //     } else if (userPackage == 'gold' && day > rawDayNow) {
  //       mcfPoints = mcfPoints + 500;
  //       rawDayNow = rawDayNow + 1;
  //       return from(
  //         this.walletRepository.update({ userName }, { mcfPoints: mcfPoints }),
  //       );
  //     } else if (userPackage == 'pioneer' && day > rawDayNow) {
  //       mcfPoints = mcfPoints + 1300;
  //       rawDayNow = rawDayNow + 1;
  //       return from(
  //         this.walletRepository.update({ userName }, { mcfPoints: mcfPoints }),
  //       );
  //     }
  //     console.log('end fu', mcfPoints);
  //     return null;
  //   } catch (err) {
  //     console.log(`${err}`);
  //     throw new Error(err);
  //   }
  // }
  shareMcf(
    userName: string,
    userPackage: string,
    lastLogin: Date,
    points: number,
  ) {
    try {
      console.log(`${lastLogin}`, `${userName}`, `${userPackage}`);
      let mcfPoints = points;
      console.log('beg fu', points);

      if (userPackage === 'bronze') {
        console.log('heere');
        mcfPoints = mcfPoints + 200;
      } else if (userPackage === 'silver') {
        mcfPoints = mcfPoints + 500;
      } else if (userPackage === 'gold') {
        mcfPoints = mcfPoints + 1000;
      } else if (userPackage === 'pioneer') {
        mcfPoints = mcfPoints + 2200;
      }
      console.log('end fu', mcfPoints);
      return from(
        this.walletRepository.update({ userName }, { mcfPoints: mcfPoints }),
      );
    } catch (err) {
      console.log(`${err}`);
      throw new Error(err);
    }
  }

  // shareMcf(
  //   userName: string,
  //   userPackage: string,
  //   lastLogin: Date,
  //   points: number,
  // ) {
  //   try {
  //     console.log(`${lastLogin}`, `${userName}`, `${userPackage}`);
  //     // const rawTime = new Date(lastLogin);
  //     // const day = rawTime.getDate();
  //     // const dateNow = new Date();
  //     // let rawDayNow = dateNow.getDate();
  //     // const timeNow = 23 - rawTimeNow;
  //     let mcfPoints = points;
  //     // console.log(day, rawTime, rawDayNow);
  //     console.log('beg fu', points);

  //     // if (this.doesUserExistWallet) {
  //     //   throw new HttpException(
  //     //     'A wallet cannot be found connected with the user',
  //     //     HttpStatus.NOT_FOUND,
  //     //   );
  //     // }

  //     if (userPackage === 'bronze') {
  //       console.log('heere');
  //       mcfPoints = mcfPoints + 200;
  //       // rawDayNow = rawDayNow + 1;
  //       // console.log(rawDayNow);
  //       return from(
  //         this.walletRepository.update({ userName }, { mcfPoints: mcfPoints }),
  //       );
  //     } else if (userPackage === 'silver') {
  //       mcfPoints = mcfPoints + 500;
  //       // rawDayNow = rawDayNow + 1;
  //       return from(
  //         this.walletRepository.update({ userName }, { mcfPoints: mcfPoints }),
  //       );
  //     } else if (userPackage === 'gold') {
  //       mcfPoints = mcfPoints + 1000;
  //       // rawDayNow = rawDayNow + 1;
  //       return from(
  //         this.walletRepository.update({ userName }, { mcfPoints: mcfPoints }),
  //       );
  //     } else if (userPackage === 'pioneer') {
  //       mcfPoints = mcfPoints + 2200;
  //       // rawDayNow = rawDayNow + 1;
  //       return from(
  //         this.walletRepository.update({ userName }, { mcfPoints: mcfPoints }),
  //       );
  //     }
  //     console.log('end fu', mcfPoints);
  //     return null;
  //   } catch (err) {
  //     console.log(`${err}`);
  //     throw new Error(err);
  //   }
  // }

  referral(
    userName: string,
    userPackage: UserPackage,
    ref: number,
    refB: number,
  ): Observable<UpdateResult> {
    console.log('heere');
    try {
      let referral = refB;
      let noReferred = ref;

      if (userPackage == 'bronze') {
        console.log('heere');
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
      console.log('end fu', refB, ref);
      return null;
    } catch (err) {
      console.log(`${err}`);
      throw new Error(err);
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

  updateUserImageById(id: number, imagePath: string): Observable<UpdateResult> {
    // console.log('return', imagePath);
    const user: User = new UserEntity();
    user.id = id;
    user.imagePath = imagePath;
    return from(this.userRepository.update(id, user));
  }

  findImageNameByUserId(id: number): Observable<string> {
    // console.log('image-name-service', id);
    return from(this.userRepository.findOne({ id })).pipe(
      map((user: User) => {
        delete user.password;
        // console.log('image-name--return-service', user.imagePath);
        return user.imagePath;
      }),
    );
  }
}
