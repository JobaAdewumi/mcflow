import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { from, map, Observable, switchMap } from 'rxjs';

import { WalletEntity } from './../models/wallet.entity';

import { UserPackage } from '../models/package.enum';
import { Wallet } from '../models/wallet.interface';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
  ) {}

  mcfPoints: number;
  referralBalance: number;
  balance: number;
  userPackage: UserPackage;

  getUserWallet(userName: string): Observable<Wallet> {
    if (!userName) {
      throw new HttpException(
        "Username of the user wasn't passed",
        HttpStatus.BAD_REQUEST,
      );
    }
    return from(this.walletRepository.findOne({ userName })).pipe(
      map((wallet: Wallet) => {
        this.mcfPoints = wallet.mcfPoints;
        this.referralBalance = wallet.referralBalance;
        this.userPackage = wallet.userPackage;
        return wallet;
      }),
    );
  }

  getUserReferralWallet(userName: string): Observable<Wallet> {
    if (!userName) {
      throw new HttpException(
        "Username of the user wasn't passed",
        HttpStatus.BAD_REQUEST,
      );
    }
    return from(
      this.walletRepository.findOne(
        { userName },
        {
          select: [
            'id',
            'referred',
            'referralBalance',
            'userName',
            'userPackage',
          ],
        },
      ),
    ).pipe(
      map((wallet: Wallet) => {
        if (!wallet) {
          throw new HttpException(
            { status: HttpStatus.NOT_FOUND, error: 'Invalid Credentials' },
            HttpStatus.NOT_FOUND,
          );
        } else {
          delete wallet.mcfPoints;
          return wallet;
        }
      }),
    );
  }
}
