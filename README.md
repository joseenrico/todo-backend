# Todo List Application - Full Stack (NestJS + React)

## Tech Stack

**Backend:**
- NestJS (Node.js v22.13 framework)
- PostgreSQL (Database)
- TypeORM (ORM)
- OpenAI API (AI Recommendations)

**Frontend:**
- React 19 + TypeScript
- Vite (Build tool)
- TailwindCSS (Styling)
- Axios (HTTP client)

## Prerequisites

- Node.js v20.x atau lebih baru
- PostgreSQL 14+
- npm atau yarn
- OpenAI API Key (opsional, untuk fitur AI)

## Installation & Running

### Option 1: Manual Setup

#### Backend Setup

```bash
# 1. Clone repository
cd todo-backend

# 2. Install dependencies
npm install

# 3. Setup env variables
# Buat file .env di root folder backend
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=todo_db
OPENAI_API_KEY=your_openai_api_key

# 4. Buat database
CREATE DATABASE todo_db;

# 5. Run development server
npm run start:dev

# Backend akan running di http://localhost:3000
```

#### Frontend Setup

```bash
# 1. Navigate to frontend folder
cd todo-frontend

# 2. Install dependencies
npm install

# 3. Setup env variables
# Buat file .env di root folder frontend
VITE_API_URL=http://localhost:3000/api
VITE_USER_ID=user-123

# 4. Run development server
npm run dev

# Frontend akan running di http://localhost:5173
```

### Option 2: Docker Setup

```bash
# 1. Pastikan Docker dan Docker Compose terinstall

# 2. Set OpenAI API Key
export OPENAI_API_KEY=your_openai_api_key_here

# 3. Build dan jalankan 
docker-compose up --build

# Backend: http://localhost:3000
# Frontend: http://localhost:80
# PostgreSQL: localhost:5432
```

## Architecture Decisions

### 1. Clean Architecture Pattern (Backend)
Menggunakan layer separation untuk maintainability:
- **Controller**: Handle HTTP requests/responses
- **Service**: Business logic dan orchestration
- **Repository**: Data access melalui TypeORM
- **DTO**: Validation dan data transformation
**Why?** Memudahkan testing, maintenance, dan scalability.

### 2. React Query untuk State Management (Frontend)
Menggunakan TanStack React Query daripada Redux/Context API.
**Why?** 
- Automatic caching dan refetching
- Built-in loading/error states

### 3. Auth via Header (x-user-id)
Menggunakan simple header-based auth daripada JWT.
**Why?** Sesuai requirement test dan cukup untuk demonstrasi. Production apps sebaiknya gunakan JWT atau OAuth.

## Project Structure

```
.
├── todo-backend/
│   ├── src/
│   │   ├── common/
│   │   │   └── guards/
│   │   │       └── auth.guard.ts
│   │   ├── todos/
│   │   │   ├── dto/
│   │   │   │   ├── create-todo.dto.ts
│   │   │   │   └── update-todo.dto.ts
│   │   │   ├── entities/
│   │   │   │   ├── todo-status.enum.ts
│   │   │   │   └── todo.entity.ts
│   │   │   ├── todos.controller.ts
│   │   │   ├── todos.service.ts
│   │   │   └── todos.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env
│   ├── Dockerfile
│   └── package.json
├── todo-frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.ts
│   │   ├── components/
│   │   │   └── common/
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── IconWrapper.tsx
│   │   │   └──  todo/
│   │   │   │   ├── TodoForm.tsx
│   │   │   │   ├── TodoModal.tsx
│   │   │   │   ├── TodoSearch.tsx
│   │   │   │   └── TodoTable.tsx
│   │   │   └──  ui/
│   │   │   │   └── LoadingSpinner.tsx
│   │   │   └──  constant/
│   │   │   │    └── todo.ts
│   │   │   └──  hooks/
│   │   │   │    ├── useTodoMutations.ts
│   │   │   │    └── useTodos.ts
│   │   │   └──  layout/
│   │   │   │    ├── Header.tsx
│   │   │   │    └── StatsCard.tsx
│   │   │   └──  types/
│   │   │   │    └── todo.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
└── docker-compose.yml
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos?search=` | Get all todos dengan filter search |
| GET | `/api/todos/:id` | Get detail todo by ID |
| POST | `/api/todos` | Create new todo |
| PATCH | `/api/todos/:id` | Update todo status |

## Features

- ✅ Create, Read, Update todos
- ✅ Search/filter todos by title
- ✅ Multiple status: created, on_going, completed, problem
- ✅ Problem description untuk status "problem"

2025 Jose Enrico
