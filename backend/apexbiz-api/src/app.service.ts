import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthCheck() {
    return {
      status: 'running',
      app: 'ApexBiz Enterprise Platform API',
      version: '1.0.0',
      message: 'ApexBiz backend is working successfully',
      modulesPlanned: [
        'Authentication',
        'RBAC',
        'Business Management',
        'Branch Management',
        'Wallet System',
        'Double-Entry Ledger',
        'Transactions',
        'POS System',
        'Inventory Management',
        'Docker',
        'CI/CD',
        'Google Cloud Deployment',
        'Grafana Monitoring',
      ],
    };
  }
}