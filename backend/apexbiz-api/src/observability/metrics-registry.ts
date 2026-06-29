type RequestMetric = {
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
};

class MetricsRegistry {
  private totalRequests = 0;
  private totalDurationMs = 0;
  private readonly statusCounts = new Map<number, number>();
  private readonly routeCounts = new Map<string, number>();

  recordRequest(metric: RequestMetric): void {
    this.totalRequests += 1;
    this.totalDurationMs += metric.durationMs;

    this.statusCounts.set(
      metric.statusCode,
      (this.statusCounts.get(metric.statusCode) || 0) + 1,
    );

    const routeKey = `${metric.method} ${metric.path}`;
    this.routeCounts.set(routeKey, (this.routeCounts.get(routeKey) || 0) + 1);
  }

  renderPrometheusMetrics(): string {
    const averageDuration =
      this.totalRequests === 0 ? 0 : this.totalDurationMs / this.totalRequests;

    const lines: string[] = [
      '# HELP apexbiz_http_requests_total Total HTTP requests handled by ApexBiz API',
      '# TYPE apexbiz_http_requests_total counter',
      `apexbiz_http_requests_total ${this.totalRequests}`,
      '',
      '# HELP apexbiz_http_request_duration_average_ms Average HTTP request duration in milliseconds',
      '# TYPE apexbiz_http_request_duration_average_ms gauge',
      `apexbiz_http_request_duration_average_ms ${averageDuration.toFixed(2)}`,
      '',
      '# HELP apexbiz_http_responses_by_status_total HTTP responses grouped by status code',
      '# TYPE apexbiz_http_responses_by_status_total counter',
    ];

    for (const [statusCode, count] of this.statusCounts.entries()) {
      lines.push(
        `apexbiz_http_responses_by_status_total{status="${statusCode}"} ${count}`,
      );
    }

    lines.push('');
    lines.push('# HELP apexbiz_http_requests_by_route_total HTTP requests grouped by route');
    lines.push('# TYPE apexbiz_http_requests_by_route_total counter');

    for (const [route, count] of this.routeCounts.entries()) {
      const safeRoute = route.replace(/"/g, '\"');
      lines.push(`apexbiz_http_requests_by_route_total{route="${safeRoute}"} ${count}`);
    }

    return lines.join('\n') + '\n';
  }
}

export const metricsRegistry = new MetricsRegistry();
