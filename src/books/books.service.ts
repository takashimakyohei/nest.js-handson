import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from "./dto/update-book.dto";

@Injectable()
export class BooksService {
  constructor(
      @InjectRepository(Book) // ここでRepositoryを注入
      private readonly bookRepository: Repository<Book>,
  ) {}

  // 1件作成
  create(createBookDto: CreateBookDto) {
    const book = this.bookRepository.create(createBookDto);
    return this.bookRepository.save(book);
  }

  // 全件取得
  findAll() {
    return this.bookRepository.find();
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