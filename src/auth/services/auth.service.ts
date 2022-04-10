import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository, UpdateResult } from 'typeorm';
import { from, map, Observable, of, switchMap, tap } from 'rxjs';
import * as bcrypt from 'bcrypt';

import { WalletService } from './wallet.service';

import { UserEntity } from '../models/user.entity';
import { WalletEntity } from '../models/wallet.entity';

import { Wallet } from '../models/wallet.interface';
import { UserPackage } from './../models/package.enum';
import { UpdatedUser } from '../models/updated-user.class';
import { User } from '../models/user.class';
import { Vendor } from '../models/vendor.class';
import { VendorEntity } from '../models/vendor.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
    @InjectRepository(VendorEntity)
    private readonly vendorRepository: Repository<VendorEntity>,
    private jwtService: JwtService,
    private walletService: WalletService,
  ) {}

  mcfPoints: number = this.walletService.mcfPoints;
  referralBalance: number = this.walletService.referralBalance;
  userPackage: UserPackage = this.walletService.userPackage;

  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }

  doesUserExist(email: string): Observable<boolean> {
    return from(this.userRepository.findOne({ email })).pipe(
      switchMap((user: User) => of(!!user)),
    );
  }

  doesUserExistWallet(userName: string): Observable<boolean> {
    return from(this.walletRepository.findOne({ userName })).pipe(
      switchMap((wallet: Wallet) => of(!!wallet)),
    );
  }
  doesVendorExist(email: string): Observable<boolean> {
    return from(this.vendorRepository.findOne({ email })).pipe(
      switchMap((vendor: Vendor) => of(!!vendor)),
    );
  }

  registerWallet(wallet: Wallet): Observable<Wallet> {
    const { userName, userPackage } = wallet;
    const mcfTPoints = 0 as any;
    const TreferralBalance = 0 as any;

    return this.doesUserExistWallet(userName).pipe(
      tap((doesUserExist: boolean) => {
        if (doesUserExist)
          throw new HttpException(
            'A user has already been created with this email address',
            HttpStatus.BAD_REQUEST,
          );
      }),
      switchMap(() => {
        return from(
          this.walletRepository.save({
            userName,
            mcfPoints: mcfTPoints,
            referralBalance: TreferralBalance,
            userPackage,
            referred: 0,
          }),
        ).pipe(
          map((wallet: Wallet) => {
            return wallet;
          }),
        );
      }),
    );
  }

  registerAccount(user: User): Observable<User> {
    const {
      firstName,
      lastName,
      userName,
      email,
      phoneNumber,
      userPackage,
      password,
    } = user;

    return this.doesUserExist(email).pipe(
      tap((doesUserExist: boolean) => {
        if (doesUserExist)
          throw new HttpException(
            'A user has already been created with this email address',
            HttpStatus.BAD_REQUEST,
          );
      }),
      switchMap(() => {
        return this.hashPassword(password).pipe(
          switchMap((hashedPassword: string) => {
            return from(
              this.userRepository.save({
                firstName,
                lastName,
                userName,
                email,
                phoneNumber,
                userPackage,
                referralLink: `http://localhost:4200/referral/${userName}`,
                password: hashedPassword,
                lastLogin: null,
                lastSharedLogin: null,
              }),
            ).pipe(
              map((user: User) => {
                delete user.password;
                return user;
              }),
            );
          }),
        );
      }),
    );
  }

  registerVendorAccount(vendor: Vendor): Observable<Vendor> {
    const { firstName, lastName, userName, email, phoneNumber, password } =
      vendor;

    return this.doesVendorExist(email).pipe(
      tap((doesUserExist: boolean) => {
        if (doesUserExist)
          throw new HttpException(
            'A vendor has already been created with this email address',
            HttpStatus.BAD_REQUEST,
          );
      }),
      switchMap(() => {
        return this.hashPassword(password).pipe(
          switchMap((hashedPassword: string) => {
            return from(
              this.vendorRepository.save({
                firstName,
                lastName,
                userName,
                email,
                phoneNumber,
                password: hashedPassword,
              }),
            ).pipe(
              map((vendor: Vendor) => {
                delete vendor.password;
                return vendor;
              }),
            );
          }),
        );
      }),
    );
  }

  validateUser(email: string, password: string): Observable<User> {
    return from(
      this.userRepository.findOne(
        { email },
        {
          select: [
            'id',
            'firstName',
            'lastName',
            'userName',
            'email',
            'phoneNumber',
            'password',
            'userPackage',
            'referralLink',
            'role',
            'lastLogin',
            'lastSharedLogin',
          ],
          relations: ['sponsoredPosts', 'wallet'],
        },
      ),
    ).pipe(
      switchMap((user: User) => {
        if (!user) {
          throw new HttpException(
            { status: HttpStatus.NOT_FOUND, error: 'Invalid Credentials' },
            HttpStatus.NOT_FOUND,
          );
        }
        return from(bcrypt.compare(password, user.password)).pipe(
          map((isValidPassword) => {
            if (isValidPassword) {
              // this.loginDate(user.id);
              delete user.password;
              return user;
            }
          }),
        );
      }),
    );
  }
  validateVendor(email: string, password: string): Observable<Vendor> {
    return from(
      this.vendorRepository.findOne(
        { email },
        {
          select: [
            'id',
            'firstName',
            'lastName',
            'userName',
            'email',
            'phoneNumber',
            'password',
          ],
        },
      ),
    ).pipe(
      switchMap((vendor: Vendor) => {
        if (!vendor) {
          throw new HttpException(
            { status: HttpStatus.NOT_FOUND, error: 'Invalid Credentials' },
            HttpStatus.NOT_FOUND,
          );
        }
        return from(bcrypt.compare(password, vendor.password)).pipe(
          map((isValidPassword) => {
            if (isValidPassword) {
              delete vendor.password;
              return vendor;
            }
          }),
        );
      }),
    );
  }

  loginDate(userId: number): Observable<UpdateResult> {
    return from(
      this.userRepository.update(userId, {
        lastLogin: new Date(),
      }),
    );
  }

  sharedDate(userId: number): Observable<UpdateResult> {
    return from(
      this.userRepository.update(userId, {
        lastSharedLogin: new Date(),
      }),
    );
  }

  login(email: string, password: string): Observable<string> {
    // const { email, password } = user;
    return this.validateUser(email, password).pipe(
      switchMap((user: User) => {
        if (user) {
          return from(this.jwtService.signAsync({ user }));
        }
      }),
    );
  }

  loginVendor(email: string, password: string): Observable<string> {
    return this.validateVendor(email, password).pipe(
      switchMap((vendor: Vendor) => {
        if (vendor) {
          return from(this.jwtService.signAsync({ vendor }));
        }
      }),
    );
  }

  updateUser(
    userId: number,
    updatedUser: UpdatedUser,
  ): Observable<UpdateResult> {
    const { email, password } = updatedUser;
    return this.doesUserExist(email).pipe(
      tap((doesUserExist: boolean) => {
        if (doesUserExist)
          throw new HttpException(
            'A user already exists with this email address',
            HttpStatus.BAD_REQUEST,
          );
      }),
      switchMap(() => {
        return this.hashPassword(password).pipe(
          switchMap((hashedPassword) => {
            return from(
              this.userRepository.update(userId, {
                email,
                password: hashedPassword,
              }),
            );
          }),
        );
      }),
    );
  }

  generateCouponCode(userPackage: string): Observable<string> {
    return from(bcrypt.hash(userPackage, 12));
  }

  async checkCouponCode(couponCode: string): Promise<string> {
    const bronzee = 'bronzemcf';
    const silverr = 'silvermcf';
    const goldd = 'goldmcf';
    const pioneerr = 'pioneermcf';
    try {
      const bronze = await bcrypt.compare(bronzee, couponCode);

      if (bronze) {
        return 'bronze';
      }
      const silver = await bcrypt.compare(silverr, couponCode);
      if (silver) {
        return 'silver';
      }
      const gold = await bcrypt.compare(goldd, couponCode);
      if (gold) {
        return 'gold';
      }
      const pioneer = await bcrypt.compare(pioneerr, couponCode);

      if (pioneer) {
        return 'pioneer';
      }
      throw new Error('Wrong coupon code');
    } catch (err) {
      throw new Error(err);
    }
  }
}
