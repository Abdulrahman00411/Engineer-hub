# EngineersHub Backend

Node.js + Express + MongoDB backend API for EngineersHub marketplace.

## Prerequisites

- Node.js 18+
- MongoDB (local or cloud instance)
- npm or yarn

## Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/engineershub
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

Start the server:

```bash
npm start        # Production
npm run dev      # Development (with auto-reload)
```

### 2. Frontend Configuration

The frontend in `Frontend/` folder is pre-configured to work with the backend. It will automatically detect if the backend is online and fall back to local storage if not.

To connect to a different backend URL, edit:
`Frontend/src/services/api.js`

```javascript
const API_URL = "http://localhost:5000/api";
```

### 3. Start Both

Terminal 1 (Backend):

```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):

```bash
cd Frontend
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Engineers

- `GET /api/engineers` - Get all engineers (with filters)
- `GET /api/engineers/:id` - Get engineer by ID
- `PUT /api/engineers/profile` - Update own profile

### Jobs

- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `POST /api/jobs` - Create new job (client only)
- `POST /api/jobs/:id/bid` - Place bid on job
- `GET /api/jobs/:id/bids` - Get bids for a job

### Gigs

- `GET /api/gigs` - Get all gigs
- `GET /api/gigs/:id` - Get gig by ID
- `POST /api/gigs` - Create gig (engineer only)
- `DELETE /api/gigs/:id` - Delete gig

### Messages

- `GET /api/messages` - Get user's conversations
- `GET /api/messages/:id` - Get conversation details
- `POST /api/messages` - Start new conversation
- `POST /api/messages/:id/message` - Send message
- `PUT /api/messages/:id/read` - Mark as read

### Clients

- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get client by ID

## Demo Accounts

After seeding the database, use these credentials:

**Engineers:**

- ahmed@example.com / 123456 (Civil Engineer, Top Rated)
- sara@example.com / 123456 (Electrical Engineer)
- omar@example.com / 123456 (Software Engineer)

**Client:**

- client@example.com / 123456 (Hassan Developers)

prmpt :
make the detailed plne to complete the following tasks ;

1. delete the seeded data , add using the register and login the users and add the post , gig, and other using the api's.
2. make the project 100% fully funstional resolve all the error ,problem aand buggs.
3. make sure the backend nad frontend is fully integrated and no error.
