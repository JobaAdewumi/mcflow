import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './controllers/post.controller';
import { SponsoredPostEntity } from './models/post.entity';
import { PostService } from './services/post.service';

@Module({
  imports: [TypeOrmModule.forFeature([SponsoredPostEntity])],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
