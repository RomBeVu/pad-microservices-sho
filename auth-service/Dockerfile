FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Set environment variables (runtime can override)
ENV OTEL_RESOURCE_ATTRIBUTES="service.name=auth-service,service.namespace=shopping-cart,deployment.environment=local"
ENV OTEL_EXPORTER_OTLP_ENDPOINT=http://tempo:4318

CMD ["npm", "run", "dev"]
