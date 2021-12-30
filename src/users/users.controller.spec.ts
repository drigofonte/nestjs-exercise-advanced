import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService> = {
    findOne: (id: number) =>
      Promise.resolve({
        id,
        email: 'me@email.com',
        password: 'mypassword',
      } as User),
    findByEmail: (email: string) =>
      Promise.resolve([{ id: 1, email, password: 'mypassword' } as User]),
    findAll: () =>
      Promise.resolve([
        { id: 1, email: 'me@email.com', password: 'mypassword' } as User,
      ]),
    remove: (id: number) => Promise.resolve(1),
    update: (id: number, attrs: Partial<User>) =>
      Promise.resolve({
        id,
        email: 'me@email.com',
        password: 'mypassword',
        ...attrs,
      } as User),
  };
  let fakeAuthService: Partial<AuthService> = {
    // signup: () => {},
    signin: (email: string, password: string) =>
      Promise.resolve({ id: 1, email, password } as User),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('returns a list of all users', async () => {
      const users = await controller.findAllUsers();
      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe('findUser', () => {
    it('returns a single user', async () => {
      const user = await controller.findUser('1');
      expect(user).not.toBeUndefined();
    });

    it('throws not found exception when the user was not found', async () => {
      fakeUsersService.findOne = (id: number) => null;
      const fn = controller.findUser('1');
      await expect(fn).rejects.toThrow(NotFoundException);
    });
  });

  describe('signin', () => {
    it('updates session and returns user', async () => {
      const session = { userId: -1 };
      const user = await controller.signin(
        { email: 'me@email.com', password: 'mypassword' },
        session,
      );
      expect(user.id).toBe(1);
      expect(session.userId).toEqual(1);
    });
  });
});
