# Project Portal

A React application for browsing and managing team projects, developed as part of the React Routing & Patterns Assessment.

The application demonstrates React Router, nested layouts, React Context, Higher-Order Components, TypeScript, and asynchronous API handling.

## Technologies

- React
- TypeScript
- Vite
- React Router
- React Context API
- Vitest
- React Testing Library
- CSS

## Features

- User authentication using a provided mock API
- Persistent sessions using localStorage
- Protected routes using a generic `withAuth` HOC
- Admin-only Settings page
- Nested routing with shared layouts
- Project listing with search and status filters
- URL-based filters that survive page refreshes
- Loading indicators and error handling
- Retry functionality for failed API requests
- Project details with formatted dates
- Dashboard Overview with project counts by status
- Compact List preference saved in localStorage
- Not Found page for unknown URLs

## Installation

**Prerequisites:** Node.js and npm.

Clone the repository:

```bash
git clone <YOUR_REPOSITORY_URL>
cd project-portal
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually `http://localhost:5173`.

## Mock Users

The provided mock API supports these usernames:

| Username  | Role   |
| --------- | ------ |
| `sara`    | Admin  |
| `youssef` | Member |

Authentication is simulated. No password is required.

## Routes

| Route                            | Description        |
| -------------------------------- | ------------------ |
| `/`                              | Home               |
| `/login`                         | Login              |
| `/dashboard`                     | Dashboard Overview |
| `/dashboard/projects`            | Project List       |
| `/dashboard/projects/:projectId` | Project Details    |
| `/dashboard/settings`            | Admin Settings     |
| `*`                              | Not Found          |

## Testing

Run the automated tests:

```bash
npm test
```

Run ESLint:

```bash
npm run lint
```

Verify the production build:

```bash
npm run build
```

## Mock API

The project uses the provided mock API in `src/api/mockApi.ts`.

API requests simulate approximately 700 ms of latency and a 20% failure probability to demonstrate loading, error handling, and retry behavior.

## Additional Documentation

- `ANSWERS.md` — Multiple-choice answers
- `NOTES.md` — Implementation decisions and explanations

## Assessment Notes

The provided `src/types.ts` and `src/api/mockApi.ts` files are kept unchanged.

No external state-management or UI component libraries are used.
