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
import { PackageName } from './../models/package.enum';
import { UpdatedUser } from '../models/updated-user.class';
import { User } from '../models/user.class';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
    private jwtService: JwtService,
    private walletService: WalletService,
  ) {}

  mcfPoints: number = this.walletService.mcfPoints;
  referralBalance: number = this.walletService.referralBalance;
  balance: number = this.walletService.balance;
  userPackage: PackageName = this.walletService.userPackage;

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

  registerWallet(wallet: Wallet): Observable<Wallet> {
    const { userName, userPackage } = wallet;
    const mcfTPoints = 0 as any;
    const Tbalance = 0 as any;
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
            balance: Tbalance,
            userPackage,
          }),
        ).pipe(
          map((wallet: Wallet) => {
            return wallet;
          }),
        );
      }),
    );
  }

  testFunc(): string {
    return 'IM working';
  }

  registerAccount(user: User): Observable<User> {
    const {
      firstName,
      lastName,
      userName,
      email,
      phoneNumber,
      packageName,
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
                packageName,
                password: hashedPassword,
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
            'packageName',
            'role',
          ],
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
              this.loginDate(user.id);
              delete user.password;
              return user;
            }
          }),
        );
      }),
    );
  }

  loginDate(userId: number) {
    return from(
      this.userRepository.update(userId, {
        lastLogin: new Date(),
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

  updateUser(
    userId: number,
    updatedUser: UpdatedUser,
  ): Observable<UpdateResult> {
    console.log('nest ser', `${updatedUser}`, `${userId}`);
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
}
