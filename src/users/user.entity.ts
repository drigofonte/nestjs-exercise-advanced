import {
  AfterCreate,
  AfterDestroy,
  AfterUpdate,
  Column,
  Table,
  PrimaryKey,
  AutoIncrement,
  Model,
} from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  email: string;

  @Column
  password: string;

  @AfterCreate
  static logInsert(args) {
    console.info('[Inserted User] ', args);
  }

  @AfterUpdate
  static logUpdate(args) {
    console.info('[Updated User] ', args);
  }

  @AfterDestroy
  static logRemove(args) {
    console.info('[Removed User] ', args);
  }
}
