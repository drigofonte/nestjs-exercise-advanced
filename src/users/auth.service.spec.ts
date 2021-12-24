import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      findByEmail: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('creates a new user with a salted and hashed password', async () => {
      const user = await service.signup('me@email.com', 'mypassword');
      const [salt, hash] = user.password.split('.');
      expect(user.password).not.toEqual('mypassword');
      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with existing email', async () => {
      await service.signup('me@email.com', 'mypassword');
      const fn = service.signup('me@email.com', 'mypassword');
      await expect(fn).rejects.toThrow(BadRequestException);
    });
  });

  describe('signin', () => {
    it('throws if called with an unused email', async () => {
      const fn = service.signin('me@email.com', '');
      await expect(fn).rejects.toThrow(NotFoundException);
    });

    it('throws if an invalid password is provided', async () => {
      await service.signup('me@email.com', 'mypassword');
      const fn = service.signin('me@email.com', 'incorrectpassword');
      await expect(fn).rejects.toThrow(BadRequestException);
    });

    it('returns a user if the correct email and password combination is provided', async () => {
      await service.signup('me@email.com', 'mypassword');
      const user = await service.signin('me@email.com', 'mypassword');
      expect(user).toBeDefined();
    });
  });
});
