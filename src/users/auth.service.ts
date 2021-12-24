import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async getHash(str: string, salt?: string) {
    if (!salt) {
      salt = randomBytes(8).toString('hex');
    }
    const hash = (await scrypt(str, salt, 32)) as Buffer;
    return `${salt}.${hash.toString('hex')}`;
  }

  async signup(email: string, password: string) {
    const users = await this.usersService.findByEmail(email);
    if (users.length) {
      throw new BadRequestException('E-mail already in use');
    }
    const user = await this.usersService.create(
      email,
      await this.getHash(password),
    );
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const [salt, hash] = user.password.split('.');
    const generatedHash = await this.getHash(password, salt);
    if (hash !== generatedHash.split('.')[1]) {
      throw new BadRequestException('Incorrect password');
    }
    return user;
  }
}
