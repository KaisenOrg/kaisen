import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { HealthController } from './health.controller';

describe('AppModule', () => {
  it('exposes the health controller', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const controller = moduleRef.get(HealthController);
    expect(controller.getHealth().status).toBe('ok');
  });
});
