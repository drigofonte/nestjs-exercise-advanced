import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private model: typeof User) {}

  create(email: string, password: string) {
    return this.model.create({ email, password });
  }

  findOne(id: number) {
    return this.model.findOne({ where: { id } });
  }

  findAll() {
    return this.model.findAll();
  }

  findByEmail(email: string) {
    return this.model.findAll({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.set(attrs);
    return user.save();
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.model.destroy({ where: {} });
  }
}
