# HireHub Onboarding Portal

A modern employee onboarding portal built with React 18 and Vite, designed to streamline the new hire onboarding experience for HR teams and employees.

## Features

- **Dashboard Overview** — At-a-glance view of onboarding progress, pending tasks, and team updates
- **Employee Registration** — Multi-step onboarding form with validation for new hires
- **Document Management** — Upload, review, and track required onboarding documents
- **Task Tracking** — Checklist-based task management for onboarding milestones
- **Admin Panel** — HR administrators can manage employees, assign tasks, and monitor progress
- **Role-Based Access** — Separate views and permissions for admins and employees
- **Progress Indicators** — Visual progress bars and status badges for onboarding completion
- **Responsive Design** — Fully responsive layout for desktop, tablet, and mobile devices
- **Client-Side Persistence** — Data persisted via localStorage and sessionStorage for demo purposes

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI library with hooks and functional components |
| **Vite** | Build tool and dev server |
| **React Router v6** | Client-side routing |
| **PropTypes** | Runtime prop type validation |
| **CSS Modules / CSS** | Component styling |
| **localStorage / sessionStorage** | Client-side data persistence |

## Folder Structure

```
hirehub-onboarding-portal/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/                  # Static assets (images, icons)
│   ├── components/              # Reusable UI components
│   │   ├── common/              # Shared components (Button, Input, Modal, etc.)
│   │   ├── layout/              # Layout components (Header, Sidebar, Footer)
│   │   └── dashboard/           # Dashboard-specific components
│   ├── context/                 # React context providers (AuthContext, OnboardingContext)
│   ├── hooks/                   # Custom React hooks (useAuth, useLocalStorage, etc.)
│   ├── pages/                   # Page/route components
│   │   ├── admin/               # Admin panel pages
│   │   ├── employee/            # Employee-facing pages
│   │   └── auth/                # Login and authentication pages
│   ├── services/                # Data services and API abstraction layer
│   ├── utils/                   # Utility functions and helpers
│   ├── data/                    # Static/seed data and constants
│   ├── App.jsx                  # Root component with router configuration
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles
├── index.html                   # HTML entry point
├── vite.config.js               # Vite configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # Project documentation
```

## Getting Started

### Prerequisites

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd hirehub-onboarding-portal
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

The production-ready files will be output to the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment (Vercel)

### Option 1: Vercel CLI

1. Install the Vercel CLI globally:

```bash
npm install -g vercel
```

2. Run the deployment command from the project root:

```bash
vercel
```

3. Follow the prompts to link your project and deploy.

4. For production deployment:

```bash
vercel --prod
```

### Option 2: Git Integration

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Log in to [vercel.com](https://vercel.com) and click **"New Project"**.
3. Import your repository.
4. Vercel will auto-detect the Vite framework. Confirm the following settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **Deploy**.

### Environment Variables (Vercel)

If environment variables are needed, add them in the Vercel dashboard under **Settings → Environment Variables**. All client-side variables must be prefixed with `VITE_`:

| Variable | Description |
|---|---|
| `VITE_APP_TITLE` | Application display title |
| `VITE_API_BASE_URL` | Base URL for API endpoints (if applicable) |

## Storage Schema

### localStorage

Data persisted across browser sessions:

| Key | Type | Description |
|---|---|---|
| `hirehub_users` | `Array<Object>` | Registered user accounts `[{ id, name, email, role, department, startDate, status }]` |
| `hirehub_tasks` | `Array<Object>` | Onboarding tasks `[{ id, employeeId, title, description, category, completed, dueDate }]` |
| `hirehub_documents` | `Array<Object>` | Uploaded document metadata `[{ id, employeeId, name, type, uploadedAt, status }]` |
| `hirehub_onboarding_progress` | `Object` | Progress tracking per employee `{ [employeeId]: { completedSteps, totalSteps, percentage } }` |
| `hirehub_settings` | `Object` | Application settings `{ theme, notifications, language }` |

### sessionStorage

Data persisted for the current browser session only:

| Key | Type | Description |
|---|---|---|
| `hirehub_auth` | `Object` | Current authenticated user session `{ userId, email, role, token, expiresAt }` |
| `hirehub_current_step` | `Number` | Current step in multi-step onboarding form |
| `hirehub_form_draft` | `Object` | Unsaved form data for recovery on page refresh |

## Admin Credentials

For demo and development purposes, use the following admin credentials:

| Field | Value |
|---|---|
| **Email** | `admin@hirehub.com` |
| **Password** | `admin123` |

> ⚠️ **Note:** These credentials are for development/demo use only. In a production environment, implement proper authentication with a backend service and secure credential management.

### Default Employee Account

| Field | Value |
|---|---|
| **Email** | `employee@hirehub.com` |
| **Password** | `employee123` |

## Available Scripts

| Script | Command | Description |
|---|---|---|
| Development | `npm run dev` | Start Vite dev server with HMR |
| Build | `npm run build` | Build for production |
| Preview | `npm run preview` | Preview production build locally |
| Lint | `npm run lint` | Run ESLint on source files |

## Browser Support

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## License

**Private** — All rights reserved. This project is proprietary and confidential. Unauthorized copying, distribution, or modification of this project is strictly prohibited.