import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './guards/jwt.strategy';
import { UserEntity } from './models/user.entity';
import { JwtGuard } from './guards/jwt.guard';
import { WalletEntity } from './models/wallet.entity';
import { AuthService } from './services/auth.service';
import { WalletService } from './services/wallet.service';
import { WalletController } from './controllers/wallet.controller';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { AuthController } from './controllers/auth.controller';
import { VendorEntity } from './models/vendor.entity';
import { CouponCodeEntity } from './models/coupon.entity';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '3600s' },
      }),
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      WalletEntity,
      VendorEntity,
      CouponCodeEntity,
    ]),
  ],
  controllers: [AuthController, WalletController, UserController],
  providers: [AuthService, JwtStrategy, JwtGuard, WalletService, UserService],
  exports: [AuthService, WalletService, UserService],
})
export class AuthModule {}
