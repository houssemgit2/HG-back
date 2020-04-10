import {
  Controller,
  Get,
  UseGuards,
  Req,
  Param,
  Put,
  Delete,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../entities/User';
import { UserService } from './user.service';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard(), AdminGuard)
  findAll(@Req() req: any) {
    return this.userService.findUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }
}
