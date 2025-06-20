import 'zone.js';

import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ZoneContextManager } from '@opentelemetry/context-zone-peer-dep';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { resourceFromAttributes } from '@opentelemetry/resources';

const resource = resourceFromAttributes({
  'service.name': process.env.REACT_APP_SERVICE_NAME || 'frontend-service',
  'service.namespace': process.env.REACT_APP_SERVICE_NAMESPACE || 'shopping-cart',
  'deployment.environment': process.env.NODE_ENV || 'local',
});

const exporter = new OTLPTraceExporter({
  url: process.env.REACT_APP_OTEL_EXPORTER_OTLP_ENDPOINT,
});

const provider = new WebTracerProvider({
  resource,
  spanProcessor: new BatchSpanProcessor(exporter),
  contextManager: new ZoneContextManager(),
});

provider.register();

registerInstrumentations({
  instrumentations: [
    new DocumentLoadInstrumentation(),
    new FetchInstrumentation({
      propagateTraceHeaderCorsUrls: /.*/,
    }),
    new XMLHttpRequestInstrumentation(),
  ],
});

console.log('OpenTelemetry v2 Web tracing initialized');
