import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

export type ApexBizEvent = {
  eventType: string;
  version: string;
  aggregateType?: string;
  aggregateId?: string;
  payload: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};

@Injectable()
export class EventBusService implements OnModuleDestroy {
  private readonly logger = new Logger(EventBusService.name);
  private connection: any = null;
  private channel: any = null;
  private readonly exchangeName = 'apexbiz.events';

  private getRabbitMqUrl(): string | undefined {
    return process.env.RABBITMQ_URL;
  }

  private async getChannel(): Promise<any | null> {
    const rabbitMqUrl = this.getRabbitMqUrl();

    if (!rabbitMqUrl) {
      return null;
    }

    if (this.channel) {
      return this.channel;
    }

    try {
      this.connection = await amqp.connect(rabbitMqUrl);
      this.channel = await this.connection.createChannel();

      await this.channel.assertExchange(this.exchangeName, 'topic', {
        durable: true,
      });

      this.connection.on('error', (error: Error) => {
        this.logger.warn(`RabbitMQ connection error: ${error.message}`);
      });

      this.connection.on('close', () => {
        this.logger.warn('RabbitMQ connection closed.');
        this.connection = null;
        this.channel = null;
      });

      return this.channel;
    } catch (error) {
      this.logger.warn(
        `RabbitMQ connection failed: ${(error as Error).message}`,
      );

      this.connection = null;
      this.channel = null;

      return null;
    }
  }

  async isAvailable(): Promise<boolean> {
    const channel = await this.getChannel();

    return Boolean(channel);
  }

  async publish(event: ApexBizEvent): Promise<boolean> {
    const channel = await this.getChannel();

    if (!channel) {
      this.logger.warn(
        `RabbitMQ is not configured or not available. Event was not published: ${event.eventType}`,
      );

      return false;
    }

    const enrichedEvent = {
      ...event,
      eventId: crypto.randomUUID(),
      occurredAt: new Date().toISOString(),
    };

    const routingKey = event.eventType;
    const payloadBuffer = Buffer.from(JSON.stringify(enrichedEvent));

    try {
      return channel.publish(this.exchangeName, routingKey, payloadBuffer, {
        persistent: true,
        contentType: 'application/json',
        type: event.eventType,
      });
    } catch (error) {
      this.logger.warn(
        `RabbitMQ publish failed for ${event.eventType}: ${(error as Error).message}`,
      );

      return false;
    }
  }

  async publishPosSaleCreated(payload: Record<string, unknown>): Promise<boolean> {
    return this.publish({
      eventType: 'pos.sale_created',
      version: '1.0',
      aggregateType: 'PosSale',
      aggregateId: String(payload.saleId || ''),
      payload,
    });
  }

  async publishInventoryStockChanged(
    payload: Record<string, unknown>,
  ): Promise<boolean> {
    return this.publish({
      eventType: 'inventory.stock_changed',
      version: '1.0',
      aggregateType: 'InventoryMovement',
      aggregateId: String(payload.productId || ''),
      payload,
    });
  }

  async publishAuditLogCreated(payload: Record<string, unknown>): Promise<boolean> {
    return this.publish({
      eventType: 'audit.log_created',
      version: '1.0',
      aggregateType: 'AuditLog',
      aggregateId: String(payload.auditLogId || ''),
      payload,
    });
  }

  async publishMlInsightsRequested(
    payload: Record<string, unknown>,
  ): Promise<boolean> {
    return this.publish({
      eventType: 'ml.insights_requested',
      version: '1.0',
      aggregateType: 'MlInsights',
      aggregateId: String(payload.businessId || ''),
      payload,
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
    }

    if (this.connection) {
      await this.connection.close();
    }
  }
}
