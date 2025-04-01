# AdminSync Monorepo Project

This is a monorepo project using pnpm workspaces to manage multiple packages and applications.

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

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v10.7.0 or higher)
- Git

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install pnpm** (if not already installed)
   ```bash
   npm install -g pnpm
   ```

3. **Install Dependencies**
   ```bash
   pnpm install
   ```

4. **Environment Setup**
   - Copy the example environment files in each application:
     ```bash
     cp app/backend/.env.example app/backend/.env
     cp app/frontend/.env.example app/frontend/.env
     ```
   - Update the environment variables as needed

## Development Workflow

### Running Applications

1. **Backend**
   ```bash
   pnpm --filter backend dev
   ```

2. **Frontend**
   ```bash
   pnpm --filter frontend dev
   ```

### Working with Shared Packages

1. **Adding a New Shared Package**
   ```bash
   cd packages
   pnpm create <package-name>
   ```

2. **Using Shared Packages in Applications**
   ```bash
   pnpm add @adminsync/<package-name> --filter <app-name>
   ```

3. **Building Shared Packages**
   ```bash
   pnpm --filter @adminsync/<package-name> build
   ```

## Package Management

### Adding Dependencies

- **To a specific package/app:**
  ```bash
  pnpm add <package-name> --filter <package-name>
  ```

- **To all packages:**
  ```bash
  pnpm add -w <package-name>
  ```

### Removing Dependencies

- **From a specific package/app:**
  ```bash
  pnpm remove <package-name> --filter <package-name>
  ```

- **From all packages:**
  ```bash
  pnpm remove -w <package-name>
  ```

## Available Scripts

- `pnpm install`: Install all dependencies
- `pnpm build`: Build all packages and applications
- `pnpm test`: Run tests across all packages
- `pnpm lint`: Run linting across all packages
- `pnpm clean`: Clean all build artifacts

## Best Practices

1. **Package Naming**
   - Use the `@adminsync` scope for all packages
   - Follow semantic versioning

2. **Dependencies**
   - Use workspace dependencies for internal packages
   - Keep shared dependencies at the root level

3. **Code Organization**
   - Keep shared code in the `packages` directory
   - Application-specific code goes in the `app` directory
