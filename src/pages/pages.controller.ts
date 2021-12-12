import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { query } from 'express';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  create(@Body() createPageDto: CreatePageDto) {
    return this.pagesService.create(createPageDto);
  }

  @Get()
  findAll() {
    return this.pagesService.findAll();
  }

  @Get(':repo')
  findOne(@Param('repo') repo: string, @Query('path') path: string) {
    return this.pagesService.findOne(repo, path);
  }

  @Patch(':repo')
  update(@Param('repo') repo: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pagesService.update(repo, updatePageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagesService.remove(+id);
  }
}
