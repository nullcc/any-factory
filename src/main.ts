import { NestFactory } from '@nestjs/core';
import { ConsoleLogger } from '@nestjs/common';
import { BootstrapConsole } from 'nestjs-console';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExceptionInterceptor } from '@infrastructure/interceptors/exception.interceptor';

export class CustomBootstrapConsole extends BootstrapConsole {
  async create() {
    const app = await NestFactory.create(AppModule);

    const appLogger = new ConsoleLogger('Any Factory');
    const config = new DocumentBuilder()
      .setTitle('Any Factory')
      .setDescription('The any factory web API description')
      .setVersion('1.0')
      .addTag('Any Factory')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    app.useGlobalInterceptors(new ExceptionInterceptor());

    app.enableShutdownHooks();

    app.getHttpServer().on('listening', () => {
      const port = app.getHttpServer().address().port;
      appLogger.log(`Application is listening on port ${port}`);
    });

    await app.listen(0);

    return app;
  }
}

const withServer = (): boolean => {
  return !!process.argv.find((e) => e === '--with-server');
};

const getBootstrap = (): BootstrapConsole => {
  if (withServer()) {
    return new CustomBootstrapConsole({
      module: AppModule,
      withContainer: true,
      useDecorators: true,
      contextOptions: { logger: false },
    } as any);
  }
  return new BootstrapConsole({
    module: AppModule,
    useDecorators: true,
  });
};

const bootstrap = getBootstrap();

bootstrap
  .init()
  .then(async (app) => {
    await app.init();
    await bootstrap.boot();
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
