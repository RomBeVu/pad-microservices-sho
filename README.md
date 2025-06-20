# 📂 Fullstack E-commerce Microservices - README

## 📚 Overview

This is a full-stack microservices-based shopping cart system built with Node.js, ReactJS, Kafka, Redis, MongoDB, and AWS S3. The architecture is containerized using Docker and orchestrated via Docker Compose.

---

## 📦 Services Summary

### 🔐 Auth Service

* **Role:** Handles user authentication (Signup, Signin, Signout).
* **Tech:** Node.js, Express, JWT, Redis
* **Kafka:** Emits `user.registered`
* **Redis:** Stores session/token data
* **Endpoints:**

  * `POST /auth/signup`
  * `POST /auth/signin`
  * `POST /auth/signout`

### 👤 User Service

* **Role:** Manages user profiles.
* **Tech:** Node.js, Express, MongoDB
* **Kafka:** Consumes `user.registered`
* **Endpoints:**

  * `GET /users/:id`
  * `PUT /users/:id`

### 📦 Product Service

* **Role:** Product catalog management with image upload.
* **Tech:** Node.js, Express, MongoDB, AWS S3
* **Kafka:** Emits `product.created`, `product.updated`, `product.deleted`
* **Endpoints:**

  * `GET /products`
  * `POST /products` (with image upload)
  * `PUT /products/:id`
  * `DELETE /products/:id`

### 🛒 Cart Service

* **Role:** User cart operations.
* **Tech:** Node.js, Express, Redis
* **Kafka:** Emits `cart.checkedout`
* **Endpoints:**

  * `GET /cart`
  * `POST /cart/add`
  * `POST /cart/remove`
  * `POST /cart/checkout`

### 📦 Order Service

* **Role:** Order placement and tracking.
* **Tech:** Node.js, Express, MongoDB
* **Kafka:**

  * Consumes `cart.checkedout`
  * Emits `order.placed`
* **Endpoints:**

  * `GET /orders`
  * `POST /orders`

### 🌐 Frontend

* **Role:** React-based client for the platform.
* **Tech:** ReactJS, Redux Toolkit, RTK Query
* **Pages:** Login, Register, ProductList, Cart, Orders

---

## 📔 Databases & Messaging

### 🧮 MongoDB

* **Used by:** auth, product, user, order services
* **Purpose:** Stores users, products, orders

### ⚡ Redis

* **Used by:** auth (sessions), cart (user carts)

### 📣 Kafka

* **Topics:**

  * `user.registered`
  * `product.created`, `product.updated`, `product.deleted`
  * `cart.checkedout`
  * `order.placed`

### ☁️ AWS S3

* **Used by:** Product service for image storage
* **SDK:** `aws-sdk`

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/microservices-shopping-cart.git
cd microservices-shopping-cart
```

### 2. Environment Setup

Create `.env` files for each service with necessary configurations (DB URI, JWT secret, Kafka, S3 credentials, etc.)

### 3. Start All Services

```bash
# In a separate terminal, start observability stack (Tempo, kafka, etc.)
docker-compose -f kafka-docker-compose.yml up --build -d

# Start core services (backend, frontend, etc.)
docker-compose -f docker-compose.yml up --build -d

```

### 4. Access

* Frontend: `http://localhost:3000`
* Auth Service: `http://localhost:4001`
* User Service: `http://localhost:4002`
* Product Service: `http://localhost:4003`
* Cart Service: `http://localhost:4004`
* Order Service: `http://localhost:4005`

---

## 📊 Observability

* **Traces:** Exported to **Grafana Tempo** using OpenTelemetry SDK and Collector.
* Each service includes:

  * `@opentelemetry/sdk-node`
  * `@opentelemetry/instrumentation-*`
  * Exports configured to send spans to OTEL Collector with Tempo exporter.
* Tempo visualization available via Grafana dashboard.

---

## 🧑‍💻 Author

**Senthilkumar Sugumar**
For queries or suggestions, feel free to connect!
