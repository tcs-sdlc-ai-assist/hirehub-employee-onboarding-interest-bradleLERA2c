# Changelog

All notable changes to the HireHub Onboarding Portal will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added

- **Landing Page**: Professional onboarding landing page with hero section, feature highlights, and call-to-action for prospective hires.
- **Interest Form with Validation**: Multi-field interest submission form including name, email, phone, role preference, and message fields with comprehensive client-side validation and real-time error feedback.
- **Admin Login**: Secure admin authentication page with credential validation and session management for accessing the admin dashboard.
- **Admin Dashboard with CRUD**: Full-featured admin panel for managing onboarding submissions — create, read, update, and delete interest form entries with sortable and filterable table views.
- **Responsive Design**: Fully responsive layout optimized for desktop, tablet, and mobile viewports ensuring a seamless experience across all device sizes.
- **localStorage Persistence**: Client-side data persistence using browser localStorage for storing form submissions and admin session state, enabling data retention across page reloads without a backend server.
- **Vercel Deployment**: Production-ready configuration for deployment on Vercel with optimized build settings and environment variable support via Vite.

### Technical Details

- Built with React 18+ and Vite for fast development and optimized production builds.
- React Router for client-side routing between landing page, interest form, admin login, and admin dashboard.
- PropTypes for runtime component prop validation.
- ES6+ JavaScript with JSX syntax throughout the codebase.
- Environment variables accessed via `import.meta.env.VITE_*` pattern.