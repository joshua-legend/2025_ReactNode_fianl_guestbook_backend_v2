import { Module } from '@nestjs/common';
import { GuestbooksService } from './guestbooks.service';
import { GuestbooksController } from './guestbooks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guestbook } from './entities/guestbook.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guestbook])],
  controllers: [GuestbooksController],
  providers: [GuestbooksService],
})
export class GuestbooksModule {}
