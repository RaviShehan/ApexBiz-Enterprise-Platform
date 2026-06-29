import { Module } from '@nestjs/common';
import { EventBusHealthController } from './event-bus-health.controller';
import { EventBusService } from './event-bus.service';

@Module({
  controllers: [EventBusHealthController],
  providers: [EventBusService],
  exports: [EventBusService],
})
export class EventBusModule {}
