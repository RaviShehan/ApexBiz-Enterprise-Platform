import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getHealthCheck', () => {
    it('should return ApexBiz backend health information', () => {
      const result = appController.getHealthCheck();

      expect(result.status).toBe('running');
      expect(result.app).toBe('ApexBiz Enterprise Platform API');
      expect(result.message).toBe('ApexBiz backend is working successfully');
      expect(result.modulesPlanned).toContain('Authentication');
      expect(result.modulesPlanned).toContain('Inventory Management');
    });
  });
});