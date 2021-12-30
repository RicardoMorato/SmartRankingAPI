import { NestFactory } from '@nestjs/core';
import * as momentTimezone from 'moment-timezone';
import { AppModule } from './app.module';
import { HttpExceptionsFilter } from './common/filters/http-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionsFilter());

  Date.prototype.toJSON = function (): any {
    return momentTimezone
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };

  await app.listen(8080);
}
bootstrap();
