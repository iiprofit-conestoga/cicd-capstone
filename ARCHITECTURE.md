# AdminSync Application Architecture

This document outlines the architecture and structure of the AdminSync application, which is built using a monorepo approach with pnpm workspaces.

## Project Overview

AdminSync is a full-stack application with the following main modules:
1. Login Module
2. User Module
3. Dashboard
4. Profile Page
5. Reset Password

## Project Structure

```
.
├── app/                    # Application packages
│   ├── backend/           # Backend Node.js application
│   └── frontend/          # Frontend React application
├── packages/              # Shared packages
│   ├── config/           # Shared configuration
│   ├── ui-library/       # Shared UI components
│   └── utils/            # Shared utilities
├── infra/                # Infrastructure configurations
├── scripts/              # Build and deployment scripts
├── package.json          # Root package.json
├── pnpm-workspace.yaml   # Workspace configuration
└── pnpm-lock.yaml        # Lock file for dependencies
```

## Detailed Structure

### 1. Frontend Structure (app/frontend)
```
app/frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── common/          # Shared components (buttons, inputs, etc.)
│   │   ├── layout/          # Layout components (navbar, sidebar)
│   │   └── forms/           # Form components
│   ├── pages/               # Page components
│   │   ├── auth/           # Login, Reset Password
│   │   ├── users/          # User management
│   │   ├── dashboard/      # Dashboard
│   │   └── profile/        # User profile
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API service calls
│   ├── utils/              # Frontend utilities
│   ├── context/            # React context (auth, theme)
│   ├── theme/              # Material UI theme configuration
│   └── styles/             # Global styles and CSS modules
```

### 2. Backend Structure (app/backend)
```
app/backend/
├── src/
│   ├── controllers/        # Business logic
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   └── profile.controller.js
│   ├── models/            # Database models
│   │   └── user.model.js
│   ├── routes/            # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   └── profile.routes.js
│   ├── middleware/        # Custom middleware
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── services/          # Business services
│   ├── utils/             # Helper functions
│   └── config/            # Configuration files
```

### 3. Shared Packages (packages/)
```
packages/
├── ui-library/            # Shared UI components
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── styles/        # Shared styles
│   │   └── theme/         # Theme configuration
│   └── package.json
├── utils/                 # Shared utilities
│   ├── src/
│   │   ├── auth/         # Authentication utilities
│   │   ├── validation/   # Form validation
│   │   └── helpers/      # Helper functions
│   └── package.json
└── config/               # Shared configuration
    ├── src/
    │   ├── constants/    # Shared constants
    │   └── schemas/      # Shared validation schemas
    └── package.json
```

## Module Specifications

### 1. Login Module

#### Frontend Requirements
- React page with 70% gradient/image (right) and 30% form (left)
- Material UI Components:
  1. Typography for application title
  2. TextField for username
  3. TextField for password
  4. Button for login
  5. Button for reset
  6. Box/Container for gradient/image
- API integration handlers

#### Backend Requirements
- Authentication API with JWT token generation
- User credential verification
- Role-based access control
- Helper methods for static values and error codes
- Router configuration
- Controller implementation

### 2. User Module

#### Frontend Requirements
- Two separate React pages:
  1. User listing page with:
     - Material UI DataGrid/Table
     - Typography for page title
     - Button for add new user
     - TextField for search
     - IconButton for edit/delete
     - Pagination component
  2. User form page with Material UI form components

#### Backend Requirements
- CRUD APIs:
  - Add user
  - Edit user
  - Update user
  - Fetch user
  - Delete user
  - List users

### 3. Dashboard

#### Frontend Requirements
- Material UI components for layout
- Typography for welcome message
- User information display
- Role-based navigation using Material UI Drawer

#### Backend Requirements
- Reuse login API user data
- No additional APIs needed

### 4. Profile Page

#### Frontend Requirements
- Material UI components for layout
- Typography for user details
- Read-only view
- No edit functionality

#### Backend Requirements
- Reuse user module's fetch user API
- No additional APIs needed

### 5. Reset Password

#### Frontend Requirements
- Material UI Components:
  1. TextField for current password
  2. TextField for new password
  3. TextField for re-enter password
  4. Button for reset
  5. Button for clear

#### Backend Requirements
- Password reset API
- Frontend integration

## Development Workflow

### 1. Setup Shared Packages
```bash
# Create shared UI components
cd packages/ui-library
pnpm create react-library

# Create shared utilities
cd ../utils
pnpm create react-library
```

### 2. Link Packages
```bash
# In frontend
pnpm add @adminsync/ui-library @adminsync/utils @mui/material @emotion/react @emotion/styled --filter frontend

# In backend
pnpm add @adminsync/utils --filter backend
```

### 3. Development Process
1. Develop shared components
2. Build backend APIs
3. Implement frontend features
4. Use workspace dependencies

## Technical Considerations

### 1. State Management
- Redux Toolkit for complex state

### 2. API Integration
- API client in shared utils
- Auth token interceptors
- Shared API schemas

### 3. Styling
- Material UI components
- CSS modules for custom styles

### 4. Testing
- Unit tests for shared packages
- API integration tests
- E2E testing

## Deployment Process

### 1. Build Process
```bash
# Build shared packages
pnpm --filter @adminsync/ui-library build
pnpm --filter @adminsync/utils build

# Build applications
pnpm --filter frontend build
pnpm --filter backend build
```

### 2. Environment Management
- Shared environment variables
- App-specific environment files
- Workspace-level variables

## Best Practices

1. **Code Organization**
   - Keep shared code in packages
   - Maintain clear module boundaries
   - Use consistent naming conventions

2. **Dependency Management**
   - Use workspace dependencies
   - Keep shared dependencies at root
   - Version packages appropriately

3. **Testing**
   - Write unit tests for shared code
   - Implement integration tests
   - Maintain test coverage


## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables
4. Start development servers:
   ```bash
   # Start backend
   pnpm --filter backend dev
   
   # Start frontend
   pnpm --filter frontend dev
   ```

## Modification in Project

1. Create feature branch
2. Make changes
3. Run tests
4. Submit pull request
