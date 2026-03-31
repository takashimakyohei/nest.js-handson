import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from "./dto/update-book.dto";
import { User } from "../users/entities/user.entity";

@Injectable()
export class BooksService {
  constructor(
      @InjectRepository(Book) // ここでRepositoryを注入
      private readonly bookRepository: Repository<Book>,
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
  ) {}

  // 1件作成
  create(createBookDto: CreateBookDto) {
    const book = this.bookRepository.create(createBookDto);
    return this.bookRepository.save(book);
  }

  // 全件取得
  async findAll() {
    const books = await this.bookRepository.find();
    const userIds = books.map(book => book.userId);
    const users = await this.userRepository.findBy({ id: In(userIds) });
    const usersHashMap = new Map<number, User>();
    for (const user of users) {
      usersHashMap.set(user.id, user);
    }

    return books.map(book => ({
      id: book.id,
      title: book.title,
      author: usersHashMap.get(book.userId)?.name || 'Unknown',
      isPublished: book.isPublished,
    }))
  }

  // 1件取得
  async findOne(id: number) {
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) throw new NotFoundException(`Book with ID ${id} not found`);
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    // 指定したIDのデータを更新する
    await this.bookRepository.update(id, updateBookDto);
    return await this.bookRepository.findOneBy({ id });
  }

  // 削除
  async remove(id: number) {
    const result = await this.bookRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException();
    return { message: 'Success' };
  }
}