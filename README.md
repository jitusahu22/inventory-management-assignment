# 📦 Inventory Management System

A full-stack inventory management application with **FIFO (First-In, First-Out) cost accounting**, real-time event streaming via **Apache Kafka**, a **React + Vite** frontend, and a **Node.js/Express + PostgreSQL** backend.

---

## 🔗 Quick Links

| Resource | URL |
|---|---|
| 🖥️ **Frontend** | http://localhost:5173 |
| 🔌 **Backend API** | http://localhost:5000/api |
| 🐘 **PostgreSQL** | `localhost:5432` |
| 🐦 **Kafka Broker** | `localhost:9092` (Docker) |

---

## 🔐 Login Credentials

| Field | Value |
|---|---|
| **Username** | `admin` |
| **Password** | `admin123` |

---

## 🧮 FIFO Logic — How It Works

The system uses **First-In, First-Out (FIFO)** costing to calculate the cost of goods sold (COGS) when a sale is made.

### Concept

When inventory is purchased, each batch is stored separately with its own:
- **Purchase timestamp** (determines depletion order)
- **Unit price** (cost at time of purchase)
- **Remaining quantity** (units not yet sold)

When a sale occurs, the system deducts stock from the **oldest batch first**, consuming newer batches only after older ones are exhausted.

### Example

| Batch | Qty Purchased | Unit Price | Remaining |
|---|---|---|---|
| Batch 1 (oldest) | 100 units | ₹10 | 60 |
| Batch 2 | 50 units | ₹15 | 50 |

**Sale of 80 units:**
- Consumes 60 from Batch 1 → 60 × ₹10 = **₹600**
- Consumes 20 from Batch 2 → 20 × ₹15 = **₹300**
- **Total COGS = ₹900**

### Implementation (`backend/src/services/fifoService.js`)

```
calculateFIFO(client, product_id, quantity)
  ├── Fetch all batches WHERE remaining_quantity > 0, ORDER BY timestamp ASC
  ├── Loop: consume oldest first using Math.min(available, needed)
  ├── Decrement remaining_quantity in DB for each consumed batch
  ├── Accumulate total cost
  └── Throw 400 if stock insufficient
```

The Kafka consumer (`backend/src/kafka/consumer.js`) calls the same `processSale` service when it receives a `SALE_RECORDED` event — no HTTP layer involved.

---

## 🗂️ Project Structure

```
inventory-management-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # PostgreSQL pool config
│   │   │   └── kafka.js           # KafkaJS client (auto SSL if API key set)
│   │   ├── controllers/           # Route handlers
│   │   ├── kafka/
│   │   │   ├── producer.js        # Publishes purchase/sale events
│   │   │   └── consumer.js        # Processes Kafka events via FIFO service
│   │   ├── middlewares/auth.js    # Session auth guard
│   │   ├── routes/                # Express routes
│   │   ├── services/
│   │   │   ├── fifoService.js     # ⭐ FIFO cost calculation
│   │   │   ├── saleService.js
│   │   │   └── purchaseService.js
│   │   └── app.js
│   ├── schema.sql                 # DB schema (3 tables)
│   ├── server.js                  # Entry point
│   ├── Dockerfile                 # Multi-stage production image
│   ├── .dockerignore
│   ├── .env                       # Local secrets (git-ignored)
│   └── .env.example               # Template
├── frontend/
│   ├── src/
│   │   ├── api/api.js             # Axios — uses VITE_API_URL env var
│   │   ├── components/            # Navbar, PurchaseForm, SaleForm, Ledger, Stock
│   │   └── pages/                 # Dashboard, Products, Login
│   ├── .env.example               # Frontend env template
│   ├── vite.config.js             # Proxy: /api → localhost:5000
│   └── package.json
└── docker-compose.yml             # Zookeeper + Kafka + Backend (ordered startup)
```

---

## 🚀 Running the Kafka Producer Locally

The Kafka producer is embedded in the backend and starts automatically when `KAFKA_ENABLED=true`.

### Option A — Docker (Recommended)

```bash
# From project root — starts Zookeeper, Kafka, then Backend (in order)
docker-compose up -d --build
```

Startup order guaranteed by healthchecks:
```
Zookeeper (healthy) → Kafka (healthy) → Backend (starts)
```

### Option B — Managed Kafka (Confluent Cloud / Upstash)

Update `backend/.env`:

```env
KAFKA_ENABLED=true
KAFKA_BROKER=your-cluster.confluent.cloud:9093
KAFKA_API_KEY=your_key
KAFKA_API_SECRET=your_secret
```

> SSL/SASL is auto-enabled in `kafka.js` when `KAFKA_API_KEY` is set.

> **Note:** Kafka is optional. If `KAFKA_ENABLED=false`, REST API works normally.

### Kafka Topics

| Topic | Trigger |
|---|---|
| `inventory.purchases` | Every new purchase batch |
| `inventory.sales` | Every completed sale |

---

## 🛠️ Local Development Setup (Step by Step)

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | >= 18.x |
| npm | >= 9.x |
| PostgreSQL | >= 14 |
| Docker Desktop | Latest (for local Kafka) |

---

### Step 1 — Clone

```bash
git clone <your-repo-url>
cd inventory-management-system
```

---

### Step 2 — PostgreSQL Setup

```bash
# Open psql
psql -U postgres

# Create DB
CREATE DATABASE inventory_db;
\q

# Run schema
psql -U postgres -d inventory_db -f backend/schema.sql
```

---

### Step 3 — Backend .env

```bash
cd backend
copy .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=inventory_db

SESSION_SECRET=any_long_random_string

CLIENT_URL=http://localhost:5173

# Leave false for local dev without Docker Kafka
KAFKA_ENABLED=false
KAFKA_BROKER=
KAFKA_CLIENT_ID=inventory-management
KAFKA_CONSUMER_GROUP=inventory-consumer-group
KAFKA_API_KEY=
KAFKA_API_SECRET=
```

---

### Step 4 — Start Backend

```bash
cd backend
npm install
npm run dev
```

✅ Running at **http://localhost:5000**

---

### Step 5 — Start Frontend

```bash
cd frontend
npm install
npm run dev
```

✅ Running at **http://localhost:5173**

> The Vite dev server proxies `/api` requests to `localhost:5000` automatically (configured in `vite.config.js`).

---

### Step 6 — (Optional) Enable Local Kafka

```bash
# From project root
docker-compose up -d zookeeper kafka
```

Wait ~30 seconds for Kafka to be healthy, then:

1. Set `KAFKA_ENABLED=true` and `KAFKA_BROKER=localhost:9092` in `backend/.env`
2. Restart backend: `Ctrl+C` → `npm run dev`

---

### Step 7 — Verify

1. Open **http://localhost:5173**
2. Login: `admin` / `admin123`
3. Add a **Product** → record a **Purchase** → record a **Sale**
4. Check the **Ledger** for ₹ FIFO cost

---

## 🌐 Production Deployment Guide (Docker Compose)

This is the easiest full-stack deployment using the included `docker-compose.yml`.

> ⚠️ **Pre-requisite:** You need a running PostgreSQL instance (on the host or managed). The compose file does NOT include a DB container.

### Step 1 — Server Setup

On your Linux VPS / cloud server:

```bash
# Install Docker & Docker Compose
sudo apt update && sudo apt install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (re-login after this)
sudo usermod -aG docker $USER
```

---

### Step 2 — Clone the Repo

```bash
git clone <your-repo-url>
cd inventory-management-system
```

---

### Step 3 — PostgreSQL on the Server

```bash
# Install
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create DB and user
sudo -u postgres psql
```

```sql
CREATE DATABASE inventory_db;
CREATE USER inv_user WITH PASSWORD 'strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inv_user;
\q
```

```bash
# Run schema
psql -U inv_user -d inventory_db -f backend/schema.sql
```

---

### Step 4 — Configure docker-compose.yml

Edit the `backend` service environment section in `docker-compose.yml`:

```yaml
environment:
  NODE_ENV: production
  PORT: 5000

  DB_HOST: host.docker.internal   # Windows/Mac Docker Desktop
  # DB_HOST: 172.17.0.1           # ← Use this on Linux servers instead
  DB_PORT: 5432
  DB_USER: inv_user
  DB_PASSWORD: strong_password_here
  DB_NAME: inventory_db

  SESSION_SECRET: generate_a_long_random_secret_here
  CLIENT_URL: https://your-frontend-domain.com

  KAFKA_ENABLED: "true"
  KAFKA_BROKER: kafka:29092        # Internal Docker network — correct!
  KAFKA_CLIENT_ID: inventory-management
  KAFKA_CONSUMER_GROUP: inventory-consumer-group
  KAFKA_API_KEY: ""
  KAFKA_API_SECRET: ""
```

> **Linux note:** Replace `host.docker.internal` with `172.17.0.1` (default Docker bridge gateway) to reach the host's PostgreSQL.

---

### Step 5 — Build and Start All Services

```bash
docker-compose up -d --build
```

This will:
1. Pull Zookeeper + Kafka images
2. Build the backend Docker image from `./backend/Dockerfile`
3. Start services in order: **Zookeeper → Kafka → Backend**

Check logs:
```bash
docker-compose logs -f backend
```

Expected output:
```
Database Connected Successfully
Kafka Producer connected successfully
Kafka Consumer connected successfully
Server is running on http://localhost:5000
```

---

### Step 6 — Deploy Frontend

The frontend is a static site. Build and serve it:

#### Option A — Vercel / Netlify (Recommended)

1. Push code to GitHub
2. Connect repo on Vercel/Netlify
3. Set:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-domain.com/api
   ```

#### Option B — Serve from VPS with Nginx

```bash
cd frontend
npm install
npm run build

# Copy dist to Nginx web root
sudo cp -r dist/* /var/www/html/
```

Basic Nginx config (`/etc/nginx/sites-available/default`):

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    # SPA routing — all routes serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls to backend
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo nginx -t && sudo systemctl restart nginx
```

---

### Step 7 — Verify Deployment

```bash
# Check all containers are running
docker-compose ps

# Should show:
# zookeeper        Up (healthy)
# kafka            Up (healthy)
# inventory-backend  Up (healthy)

# Test backend API
curl http://localhost:5000/
# → {"message":"Server Running"}
```

---

## 📡 API Reference

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | ❌ | Login |
| `POST` | `/api/auth/logout` | ✅ | Logout |
| `GET` | `/api/products` | ✅ | List products |
| `POST` | `/api/products` | ✅ | Create product |
| `GET` | `/api/purchase` | ✅ | List purchase batches |
| `POST` | `/api/purchase` | ✅ | Record purchase |
| `GET` | `/api/sale` | ✅ | List sales |
| `POST` | `/api/sale` | ✅ | Record sale (FIFO) |
| `GET` | `/api/inventory` | ✅ | Stock overview |
| `GET` | `/api/ledger` | ✅ | Transaction ledger |

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 8, TailwindCSS 4, MUI 9, React Router 7 |
| **Backend** | Node.js 20, Express 4, express-session, Helmet, Morgan |
| **Database** | PostgreSQL 14+ (`pg` driver) |
| **Messaging** | Apache Kafka (KafkaJS 2) |
| **Containerization** | Docker Compose — Zookeeper + Kafka + Backend |

---

## 📝 License

ISC
