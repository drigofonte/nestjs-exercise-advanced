import {
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  Model,
} from 'sequelize-typescript';

@Table({ tableName: 'reports' })
export class Report extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  price: number;
}
