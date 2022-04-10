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
      throw new Error(err);
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
      throw new Error(err);
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
    const user: User = new UserEntity();
    user.id = id;
    user.imagePath = imagePath;
    return from(this.userRepository.update(id, user));
  }

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
