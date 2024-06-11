import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto';
import { Cookies } from 'src/shared/common/decorator';
import { IddService } from '../idd/idd.service';
import { ResponseService } from 'src/shared/response/response.service';

@Controller('form')
export class FormController {
  constructor(
    private formService: FormService,
    private iddService: IddService,
    private responseService: ResponseService,
  ) {}

  @Post()
  async createForm(@Body() data: CreateFormDto, @Cookies('lang') lang: string) {
    await this.formService.createForm(data, lang);
    return this.responseService.successWithoutData();
  }

  @Get('/idd')
  async getIdd(@Query('search') search: string) {
    const data = await this.iddService.findAll({ search });
    return this.responseService.success(200, data);
  }
}
