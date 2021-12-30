import { Test, TestingModule } from '@nestjs/testing';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/sequelize';

describe('UsersService', () => {
  let service: UsersService;
  let model: typeof User;
  let modelFns: {
    findAll: () => Promise<User[]>;
  };

  beforeEach(async () => {
    modelFns = {
      findAll: () => Promise.resolve([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: modelFns,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<typeof User>(getModelToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('returns all users', async () => {
      // Arrange
      const userOne = {
        id: 1,
        email: 'me@email.com',
        password: 'mypassword',
      } as User;
      const userTwo = {
        id: 2,
        email: 'another_me@email.com',
        password: 'another_mypassword',
      } as User;

      modelFns.findAll = () => Promise.resolve([userOne, userTwo]);

      // Act
      const users = await service.findAll();

      // Assert
      expect(users.length).toBe(2);
      expect(users.includes(userOne)).toBeTruthy();
      expect(users.includes(userTwo)).toBeTruthy();
    });
  });
});
