import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client'; // Import UserRole

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // This endpoint is now admin-only for creating users with specific roles/data if needed.
  // Public user registration should happen via /auth/register.
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // Ensure UsersService.create properly handles password hashing if it's not pre-hashed,
    // or this DTO should expect a hashedPassword.
    // Given AuthService.register calls UsersService.create with a hashed password,
    // this admin endpoint would likely expect a plain password and hash it,
    // or the CreateUserDto for this admin route should be different (e.g., AdminCreateUserDto).
    // For now, assuming CreateUserDto might contain a plain password that UsersService.create
    // (or a dedicated admin_create method) should handle hashing.
    // This was identified as a risk if UsersService.create stores plain text.
    // For this step, we are focusing on endpoint protection. Password handling in service is a separate concern.
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}