import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectModel(Report) private model: typeof Report) {}
}
