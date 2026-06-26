# EngineersHub

A freelancer marketplace platform connecting engineers with clients for engineering projects and gigs.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** PostgreSQL + Prisma ORM
- **Docker:** Docker Compose

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL client (optional, for terminal database access)

## Quick Start

### 1. Start All Containers

```bash
docker compose up -d
```

This starts:

- PostgreSQL (port 5432)
- Backend API (port 5000)

### 2. Verify Containers Running

```bash
docker compose ps
```

### 3. Access the Application

- **Frontend:** http://localhost:5173 (run locally with `cd frontend && npm run dev`)
- **Backend API:** http://localhost:5000
- **Database:** localhost:5432

---

## Docker Commands

### Start Containers

```bash
docker compose up -d          # Start in detached mode
docker compose up           # Start in foreground (see logs)
```

### Stop Containers

```bash
docker compose stop         # Stop all containers
docker compose stop postgres  # Stop specific container
```

### Restart Containers

```bash
docker compose restart          # Restart all
docker compose restart backend # Restart specific service
```

### Remove Containers

```bash
docker compose down           # Remove containers (keeps data)
docker compose down -v       # Remove containers AND volumes (deletes data!)
```

### View Logs

```bash
docker compose logs         # All logs
docker compose logs -f     # Follow logs
docker compose logs backend  # Backend logs only
docker compose logs postgres # Database logs
```

### Rebuild Containers

```bash
docker compose build       # Rebuild without starting
docker compose up -d --build  # Rebuild and start
```

---

## Database Access

### Option 1: Using psql in Container

```bash
# Enter PostgreSQL container
docker exec -it engineershub-postgres psql -U postgres -d engineershub

# Inside psql, run commands:
\x auto                    # Expanded display mode
SELECT * FROM "User";      # View all users
SELECT * FROM "Job";       # View all jobs
SELECT * FROM "Gig";       # View all gigs
\q                        # Exit psql
```

#### Useful psql Commands

| Command          | Description                        |
| ---------------- | ---------------------------------- |
| `\dt`            | List all tables                    |
| `\d "TableName"` | Describe table schema              |
| `\x auto`        | Toggle expanded (vertical) display |
| `\q`             | Quit psql                          |

#### Example Queries

```sql
-- View all users
SELECT id, name, email, role, rating FROM "User";

-- View freelancers only
SELECT name, email, rating, hourlyRate FROM "User" WHERE role = 'freelancer';

-- View open jobs
SELECT title, category, budget, status FROM "Job" WHERE status = 'open';

-- Count records
SELECT COUNT(*) FROM "User";
```

### Option 2: Using Prisma Studio (GUI)

```bash
cd backend
npx prisma studio
```

Opens at: http://localhost:5555

### Option 3: Run Single Command

```bash
docker exec -it engineershub-postgres psql -U postgres -d engineershub -c "SELECT COUNT(*) FROM \"User\";"
```

---

## Running the Frontend (Local Dev)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173

---

## Environment Variables

Create a `.env` file in backend directory (or use `docker.env`):

```env
DATABASE_URL="URL"
JWT_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
```

---

## Project Structure

```
engineershub/
├── backend/
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── middleware/    # Auth middleware
│   │   ├── routes/       # API routes
│   │   │   ├── auth.js       # Login/Register
│   │   │   ├── engineers.js  # Engineer profiles
│   │   │   ├── clients.js   # Client profiles
│   │   │   ├── jobs.js       # Job postings
│   │   │   ├── gigs.js      # Engineer gigs
│   │   │   ├── bids.js      # Job bids
│   │   │   ├── orders.js   # Gig orders
│   │   │   ├── messages.js # Messages
│   │   │   └── admin.js    # Admin routes
│   │   └── index.js      # Entry point
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/    # React context
│   │   ├── services/   # API service
│   │   └── App.jsx    # Main app
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── docker-compose.yml
├── docker.env
└── README.md
```

---

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Engineers

- `GET /api/engineers` - List engineers
- `GET /api/engineers/:id` - Get engineer profile

### Clients

- `GET /api/clients` - List clients

### Jobs

- `GET /api/jobs` - List jobs
- `POST /api/jobs` - Create job (client)
- `GET /api/jobs/:id/bids` - Get job bids

### Gigs

- `GET /api/gigs` - List gigs
- `POST /api/gigs` - Create gig (engineer)

### Orders

- `GET /api/orders` - List orders
- `PUT /api/orders/:id` - Update order status

### Messages

- `GET /api/messages` - Get conversations
- `POST /api/messages` - Send message

---

## Database Schema

### Tables

| Table          | Description                |
| -------------- | -------------------------- |
| `User`         | Engineers and clients      |
| `Job`          | Job postings               |
| `Gig`          | Engineer service offerings |
| `Bid`          | Job bids                   |
| `Order`        | Gig orders                 |
| `Message`      | Messages                   |
| `Conversation` | Chat conversations         |

---

## Troubleshooting

### Container won't start

```bash
# Check logs
docker compose logs backend
docker compose logs postgres

# Rebuild
docker compose up -d --build
```

### Database connection errors

```bash
# Restart postgres
docker compose restart postgres

# Wait for health check
docker compose up -d
```

### Reset database

```bash
# Stop and remove with volumes
docker compose down -v

# Start fresh
docker compose up -d
```

### Prisma errors

```bash
# Regenerate Prisma client
cd backend
npx prisma generate
```

---

## License

MIT
