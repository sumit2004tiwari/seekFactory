# Backend API

Express.js backend for supplier registration and authentication system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB connection string and other settings.

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new supplier
- `POST /api/auth/login` - Login existing user

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── config/         # Configuration files
│   ├── utils/          # Utility functions
│   └── server.js       # Main server file
├── package.json
├── .env.example
└── README.md
```

## Environment Variables

See `.env.example` for required environment variables.
