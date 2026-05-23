# The StayEase — Customer-Facing Booking Website

A production-style customer-facing hotel booking website built with **Next.js 14**, **NextAuth**, and a **Django REST Framework** backend.

It supports Google sign-in, guest account creation, cabin browsing, date-based booking, reservation management, and secure API access through a custom guest authentication flow.

**Live Demo:** https://stayease-app-zeta.vercel.app/

---

## What this project demonstrates



- Full-stack integration between **Next.js** and **Django REST Framework**
- **Google OAuth login** with NextAuth
- A **custom guest JWT system** for customer-facing authentication
- Booking workflows with date validation and reservation rules
- Server-side data fetching and protected routes
- Production deployment on **Vercel** with a separate deployed backend
- Practical handling of auth, state, caching, and API contracts

---

## Features

- Browse available cabins
- View cabin details and booked dates
- Google sign-in for guests
- Automatic guest creation in the backend
- Custom access and refresh token flow for guest users
- Create bookings from the customer portal
- View guest reservations
- Edit and delete bookings
- Profile page for guest details
- Responsive UI for desktop and mobile

---

## Architecture

### Frontend
- Next.js 14 App Router
- React
- NextAuth
- Server Components + Server Actions
- Optimistic UI for smoother interactions
- TypeScript

### Backend
- Django
- Django REST Framework
- Custom guest authentication
- JWT-based guest access and refresh tokens
- PostgreSQL
- Redis caching
- Celery worker for async tasks
- CORS handling for frontend access

### Authentication Flow
1. User signs in with Google
2. NextAuth receives the authenticated Google identity
3. Frontend checks whether the guest exists in the Django backend
4. If not, a guest record is created
5. Backend issues with guest access and refresh tokens
6. Tokens are attached to protected API requests
7. Expired access tokens are refreshed automatically

---

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, NextAuth
- **Backend:** Django, Django REST Framework
- **Database:** PostgreSQL
- **Cache:** Redis
- **Background Jobs:** Celery
- **Deployment:** Vercel + backend hosting platform
- **Styling:** Tailwind CSS



## Folder Structure

```bash
app/
├── _components/
├── _context/
├── _lib/
├── about/
├── account/
├── api/
├── cabins/
├── signin/
├── signup/
└── ...
```


## Local Development
- Frontend
- npm install
- npm run dev
- Backend
- python -m venv venv
- source venv/bin/activate   # or venv\Scripts\activate on Windows
- pip install -r requirements.txt
- python manage.py migrate
- python manage.py runserver

### Key Challenges Solved

- Designed a custom authentication flow for a customer-facing app without relying on Django’s default user model
- Separated internal staff authentication from guest authentication systems
- Implemented secure JWT lifecycle (access + refresh token handling)
- Handled token expiry and refresh across server-side requests
- Built booking flows with a consistent state after create/update/delete operations
- Managed cache invalidation and real-time data consistency
- Applied Next.js rendering strategies (Server Components, Server Actions, and optimised data fetching)
- Implemented optimistic UI updates with proper rollback handling
- Debugged and fixed production build issues caused by strict TypeScript constraints
- Deployed a decoupled full-stack system (Next.js frontend + Django backend)

### Live Link  https://stayease-app-zeta.vercel.app/

License

MIT
