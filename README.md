# TKS Balaji Maligai - Modern Grocery Ecommerce

A premium, full-stack grocery ecommerce web application built for local delivery.

## Tech Stack
- **Frontend:** Next.js, React.js, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, Google OAuth 2.0 (configured)

## Features
- Modern UI with Framer Motion animations
- Mobile-first responsive design
- User Authentication (Login / Register)
- Browse Products & Categories
- Cart & Checkout flow
- Order Tracking System
- Admin Dashboard to manage products, categories, and orders
- Dark/Light Mode

## Folder Structure
- `/client` - Next.js Frontend
- `/server` - Node.js Express Backend

## Environment Variables

### Backend (`/server/.env`)
Create a `.env` file in the `/server` directory:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Frontend (`/client/.env.local`)
Create a `.env.local` file in the `/client` directory:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Running Locally

1. **Start Backend Server:**
```bash
cd server
npm install
npm run dev
```

2. **Start Frontend App:**
```bash
cd client
npm install
npm run dev
```

The frontend will run at `http://localhost:3000` and the backend at `http://localhost:5000`.

## Deployment Guide

### Vercel Deployment

**Frontend (`/client`):**
1. Push the repository to GitHub.
2. In Vercel, import the project.
3. Set the **Framework Preset** to Next.js.
4. Set the **Root Directory** to `client`.
5. Add the `NEXT_PUBLIC_API_URL` environment variable pointing to your deployed backend.
6. Click Deploy.

**Backend (`/server`):**
1. In Vercel, import the project again.
2. Set the **Framework Preset** to Other.
3. Set the **Root Directory** to `server`.
4. Ensure the `vercel.json` file in `/server` is present.
5. Add the backend environment variables (`MONGO_URI`, `JWT_SECRET`, etc.).
6. Click Deploy.

### Netlify Deployment

**Frontend (`/client`):**
1. Create a `netlify.toml` in the `/client` folder (if you want to customize the build, though Netlify auto-detects Next.js).
2. Connect your repository to Netlify.
3. Set the base directory to `client`.
4. Add the necessary environment variables.
5. Deploy Site.

*(Note: Deploying Express backends on Netlify requires rewriting the app to use Netlify Functions. Vercel or Render is recommended for the Node/Express backend).*
