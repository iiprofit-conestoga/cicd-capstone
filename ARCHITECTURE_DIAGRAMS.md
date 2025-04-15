# AdminSync Architecture Diagrams

This document contains visual diagrams representing the AdminSync application architecture.

## 1. Project Structure Overview

```mermaid
graph TD
    A[AdminSync Monorepo] --> B[app]
    A --> C[packages]
    A --> D[infra]
    A --> E[scripts]
    
    B --> B1[frontend]
    B --> B2[backend]
    
    C --> C1[ui-library]
    C --> C2[utils]
    C --> C3[config]
    
    B1 --> B1a[components]
    B1 --> B1b[pages]
    B1 --> B1c[services]
    B1 --> B1d[theme]
    
    B2 --> B2a[controllers]
    B2 --> B2b[models]
    B2 --> B2c[routes]
```

## 2. Frontend Component Structure

```mermaid
graph TD
    A[Frontend] --> B[Components]
    A --> C[Pages]
    A --> D[Services]
    A --> E[Theme]
    
    B --> B1[Common]
    B --> B2[Layout]
    B --> B3[Forms]
    
    C --> C1[Auth]
    C --> C2[Users]
    C --> C3[Dashboard]
    C --> C4[Profile]
    
    D --> D1[API Services]
    D --> D2[Auth Services]
    
    E --> E1[Material UI Theme]
    E --> E2[Custom Styles]
```

## 3. Backend Architecture

```mermaid
graph TD
    A[Backend] --> B[Controllers]
    A --> C[Models]
    A --> D[Routes]
    A --> E[Middleware]
    
    B --> B1[Auth Controller]
    B --> B2[User Controller]
    B --> B3[Profile Controller]
    
    C --> C1[User Model]
    
    D --> D1[Auth Routes]
    D --> D2[User Routes]
    D --> D3[Profile Routes]
    
    E --> E1[Auth Middleware]
    E --> E2[Error Middleware]
```

## 4. Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: Enter credentials
    Frontend->>Backend: POST /auth/login
    Backend->>Database: Verify credentials
    Database-->>Backend: User data
    Backend->>Backend: Generate JWT
    Backend-->>Frontend: JWT + User data
    Frontend->>Frontend: Store JWT
    Frontend-->>User: Redirect to Dashboard
```

## 5. User Management Flow

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant Backend
    participant Database
    
    Admin->>Frontend: Access User List
    Frontend->>Backend: GET /users
    Backend->>Database: Fetch users
    Database-->>Backend: User list
    Backend-->>Frontend: User data
    
    Admin->>Frontend: Edit User
    Frontend->>Backend: PUT /users/:id
    Backend->>Database: Update user
    Database-->>Backend: Updated user
    Backend-->>Frontend: Success response
```

## 6. Shared Packages Integration

```mermaid
graph LR
    A[Frontend] --> B[ui-library]
    A --> C[utils]
    A --> D[config]
    A --> E[Material UI]
    
    F[Backend] --> C
    F --> D
    
    B --> D
    C --> D
    E --> B
```

## 7. Data Flow Architecture

```mermaid
graph TD
    A[Frontend] -->|API Calls| B[Backend]
    B -->|Database Operations| C[Database]
    
    D[Shared Utils] -->|API Schemas| A
    D -->|API Schemas| B
    
    E[UI Library] -->|Components| A
    
    F[Config] -->|Constants| A
    F -->|Constants| B
    
    G[Material UI] -->|Theme| A
    G -->|Components| E
```

## 8. Module Dependencies

```mermaid
graph TD
    A[Login Module] -->|JWT| B[Dashboard]
    A -->|User Data| C[Profile]
    A -->|Auth| D[User Management]
    
    B -->|User Info| C
    D -->|User Data| C
    
    E[Reset Password] -->|Auth| A
    
    F[Material UI] -->|Theme| A
    F -->|Theme| B
    F -->|Theme| C
    F -->|Theme| D
    F -->|Theme| E
```

## 9. Development Workflow

```mermaid
graph LR
    A[Setup] --> B[Development]
    B --> C[Testing]
    C --> D[Deployment]
    
    B --> B1[Frontend]
    B --> B2[Backend]
    B --> B3[Shared Packages]
    
    C --> C1[Unit Tests]
    C --> C2[Integration Tests]
    C --> C3[E2E Tests]
    
    B1 --> B1a[Material UI Setup]
    B1 --> B1b[Component Development]
```

## 10. Deployment Architecture

```mermaid
graph TD
    A[Development] -->|Build| B[Production]
    
    B --> C[Frontend Server]
    B --> D[Backend Server]
    B --> E[Database]
    
    C -->|API Calls| D
    D -->|Data| E
    
    F[Shared Packages] -->|Build| C
    F -->|Build| D
    
    G[Material UI] -->|Styles| C
```

## 11. CI/CD Deployment Architecture

### Textual Overview

```
┌──────────────┐
│  Developer   │
│  (Git Push)  │
└──────┬───────┘
       │
       ▼
┌────────────────────────────┐
│        GitHub Repo         │
│ (Webhooks: Push/PR Events) │
└──────┬─────────────────────┘
       │
       ▼
┌────────────────────────────┐
│         Jenkins            │
│ (Pipeline on Webhook)      │
│                            │
│ 1. Checkout code           │
│ 2. Install dependencies    │
│ 3. Run tests               │
│ 4. Terraform:              │
│    - Plan/Apply Infra      │
│    - Get ALB DNS outputs   │
│ 5. Build Docker images     │
│    - Backend               │
│    - Frontend (with API URL│
│      from Terraform output)│
│ 6. Push images to registry │
│ 7. Deploy to ECS           │
│ 8. Health checks           │
└──────┬─────────────────────┘
       │
       ▼
┌────────────────────────────┐
│        AWS Cloud           │
│                            │
│ ┌─────────────┐            │
│ │  ECS Fargate │           │
│ │  Cluster     │           │
│ │  (Services)  │           │
│ └─────┬───────┘            │
│       │                    │
│       ▼                    │
│ ┌─────────────┐   ┌─────────────┐
│ │ Frontend    │   │ Backend     │
│ │ Service     │   │ Service     │
│ └─────┬───────┘   └─────┬───────┘
│       │                 │
│       ▼                 ▼
│ ┌─────────────┐   ┌─────────────┐
│ │ ALB (80)    │   │ ALB (3000)  │
│ │ Frontend    │   │ Backend     │
│ └─────┬───────┘   └─────┬───────┘
│       │                 │
│       ▼                 ▼
│   Users (Web)      Frontend → Backend
│                    (API Calls)
└────────────────────────────┘
```

### Mermaid Diagram

```mermaid
graph TD
    Dev[Developer (Git Push)] --> GH[GitHub Repo]
    GH -->|Webhook| Jenkins[Jenkins Pipeline]
    Jenkins -->|Terraform Plan/Apply| AWS[AWS Cloud]
    Jenkins -->|Build & Push Docker Images| AWS
    Jenkins -->|Deploy to ECS| AWS
    AWS --> FE[Frontend Service (ECS Fargate)]
    AWS --> BE[Backend Service (ECS Fargate)]
    FE --> FEALB[Frontend ALB (80)]
    BE --> BEALB[Backend ALB (3000)]
    FEALB --> User[Users (Web)]
    FE -->|API Calls| BEALB
    BEALB --> BE
```

## Notes

1. These diagrams are created using Mermaid syntax and can be rendered on GitHub
2. The diagrams represent different aspects of the application architecture

## How to View

1. These diagrams can be viewed directly on GitHub