import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Book } from "./entities/book.entity";
import { User } from "../users/entities/user.entity";

@Module({
  // Bookエンティティに紐付いたTypeORMの標準リポジトリ機能を有効化する
  imports: [TypeOrmModule.forFeature([Book, User])],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
