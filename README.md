# NLT Backend API

Backend API built with Node.js, Express, and Supabase.

## 🚀 Features

- Node.js + Express.js server
- Supabase PostgreSQL database integration
- Authentication with Supabase Auth
- Serverless deployment with Cloudflare Workers
- MVC architecture
- CORS enabled for development

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Cloudflare account (for deployment)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nlt-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your Supabase credentials:
- Get your Supabase URL and keys from your Supabase project dashboard
- Update CORS_ORIGIN if needed

## 🏃‍♂️ Running Locally

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## ☁️ Deploying to Cloudflare Workers

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Create `wrangler.toml` configuration:
```toml
name = "nlt-backend"
main = "src/index.js"
compatibility_date = "2024-01-01"

[vars]
NODE_ENV = "production"
```

4. Deploy:
```bash
npm run deploy
```

## 📁 Project Structure

```
/src
  /controllers    # Route controllers
  /models         # Database models
  /routes         # API routes
  /middlewares    # Custom middlewares
  /services       # Business logic
  /utils          # Utility functions
  index.js        # Application entry point
```

## 🔒 Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `CORS_ORIGIN`: Allowed CORS origin

## 📝 License

MIT 