import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CheckSectionAccessDto, CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':identity')
  findOne(@Param('identity') identity: string) {
    return this.usersService.findOne(identity);
  }

  @Post()
  create(@Body() payload: CreateUserDto) {
    return this.usersService.create(payload);
  }

  @Patch(':identity')
  update(@Param('identity') identity: string, @Body() payload: UpdateUserDto) {
    return this.usersService.update(identity, payload);
  }

  @Delete(':identity')
  remove(@Param('identity') identity: string) {
    return this.usersService.remove(identity);
  }

  @Post(':identity/sections/access-check')
  checkSectionAccess(
    @Param('identity') identity: string,
    @Body() payload: CheckSectionAccessDto,
  ) {
    return this.usersService.canAccessNextSection(identity, payload);
  }
}
