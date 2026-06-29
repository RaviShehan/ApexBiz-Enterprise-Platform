import { Controller, Get, Post } from '@nestjs/common';
import { EventBusService } from './event-bus.service';

@Controller('event-bus')
export class EventBusHealthController {
  constructor(private readonly eventBusService: EventBusService) {}

  @Get('health')
  async health() {
    const available = await this.eventBusService.isAvailable();

    return {
      service: 'rabbitmq-event-bus',
      status: available ? 'available' : 'unavailable',
      configured: Boolean(process.env.RABBITMQ_URL),
      exchange: 'apexbiz.events',
      timestamp: new Date().toISOString(),
    };
  }

  @Post('demo-event')
  async publishDemoEvent() {
    const published = await this.eventBusService.publish({
      eventType: 'system.demo_event',
      version: '1.0',
      aggregateType: 'System',
      aggregateId: 'demo',
      payload: {
        message: 'ApexBiz demo event',
      },
    });

    return {
      published,
      message: published
        ? 'Demo event published to RabbitMQ.'
        : 'RabbitMQ unavailable. Demo event was not published.',
    };
  }
}
