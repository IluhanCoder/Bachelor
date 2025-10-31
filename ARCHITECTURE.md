# 🏗️ Architecture Documentation

## System Overview

Backlogger follows a **three-tier architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                        │
│  (React + TypeScript + Tailwind + MobX)                │
└────────────────┬────────────────────────────────────────┘
                 │ HTTP/REST API
                 │ JWT Authentication
┌────────────────▼────────────────────────────────────────┐
│                    Server Layer                         │
│  (Node.js + Express + TypeScript)                      │
└────────────────┬────────────────────────────────────────┘
                 │ Mongoose ODM
                 │
┌────────────────▼────────────────────────────────────────┐
│                   Database Layer                        │
│  (MongoDB - Document Store)                            │
└─────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Organization

```
src/
├── analytics/          # Analytics & visualization
│   ├── analytics-page.tsx          # Main analytics dashboard
│   ├── quick-stats-cards.tsx       # Stats overview cards
│   ├── velocity-chart.tsx          # Sprint velocity visualization
│   ├── top-contributors-table.tsx  # Team leaderboard
│   ├── graph.tsx                   # Reusable chart component
│   └── date-picker.tsx             # Custom date selector
│
├── task/              # Task management
│   ├── board-window.tsx            # Kanban board
│   ├── new-task-form.tsx           # Task creation
│   ├── task-info-form.tsx          # Task editing
│   ├── assign-form.tsx             # Executor assignment
│   └── task-service.ts             # API calls
│
├── sprint/            # Sprint management
│   ├── backlog-sprints-mapper.tsx  # Sprint list with progress
│   ├── new-sprint-form.tsx         # Sprint creation
│   ├── edit-sprint-form.tsx        # Sprint editing
│   └── sprint-service.ts           # API calls
│
├── project/           # Project management
│   ├── project-page.tsx            # Project overview
│   ├── projects-page.tsx           # All projects list
│   ├── edit-rights-page.tsx        # Permission management
│   └── participants-window.tsx     # Team management
│
├── auth/              # Authentication
│   ├── login-form.tsx              # Login UI
│   ├── registration-page.tsx       # Registration UI
│   └── auth-service.ts             # JWT handling
│
└── forms/             # Form infrastructure
    ├── form-component.tsx          # Modal wrapper
    ├── form-store.ts               # MobX store for modals
    └── form-closer-provider.tsx    # Click-outside handler
```

### State Management (MobX)

```typescript
// Store Pattern Example
class UserStore {
  @observable user: UserResponse | null = null;
  @observable isAuthenticated: boolean = false;

  @action
  setUser(user: UserResponse) {
    this.user = user;
    this.isAuthenticated = true;
  }
}
```

**Stores:**
- `userStore` - Current user state
- `errorStore` - Global error handling
- `formStore` - Modal form management

### Routing Structure

```typescript
/ (root)
├── /login                    # Authentication
├── /register                 # User registration
├── /projects                 # User's projects list
├── /project/:id              # Single project view
│   ├── Backlogs
│   ├── Participants
│   └── Settings
├── /analytics/:projectId     # Analytics dashboard
├── /board/:projectId         # Kanban board
└── /profile/:userId          # User profile
```

## Backend Architecture

### Layered Structure

```
Controller Layer (HTTP handling)
       ↓
Service Layer (Business logic)
       ↓
Model Layer (Database schemas)
```

### Key Services

#### 1. **Task Service**
- CRUD operations
- Permission validation using aggregation pipelines
- Status management
- Executor assignment

```typescript
// Permission Check Example
async canUserEditTask(taskId: string, userId: string) {
  const result = await TaskModel.aggregate([
    { $match: { _id: new ObjectId(taskId) } },
    { $lookup: { /* Join with projects */ } },
    { $lookup: { /* Join with users */ } }
  ]);
  
  // Check: Owner OR has edit right OR creator
  return isOwner || hasEditRight || isCreator;
}
```

#### 2. **Analytics Service**
- Time-series data aggregation
- Story Points calculations
- Velocity tracking
- Predictive analysis using linear regression

```typescript
// Velocity Calculation
async getVelocityData(projectId: string) {
  // Get last 10 sprints
  // Calculate total SP and completed SP per sprint
  // Return sorted by date
}
```

#### 3. **Sprint Service**
- Sprint lifecycle management
- Task assignment to sprints
- Complex aggregation for task population

```typescript
// Task Population Pattern
const sprints = await Promise.all(
  sprintList.map(async (sprint) => {
    const tasks = await TaskModel.aggregate([
      { $match: { _id: { $in: sprint.tasks } } },
      { $lookup: { from: 'users', ... } }
    ]);
    return { ...sprint, tasks };
  })
);
```

## Database Design

### Collections

#### **Users**
```javascript
{
  _id: ObjectId,
  name: String,
  surname: String,
  nickname: String,
  email: String (unique),
  password: String (hashed),
  organisation: String,
  image: String (base64)
}
```

#### **Projects**
```javascript
{
  _id: ObjectId,
  name: String,
  owner: ObjectId (ref: User),
  participants: [{
    participant: ObjectId (ref: User),
    rights: {
      create: Boolean,
      edit: Boolean,
      delete: Boolean,
      check: Boolean,
      editParticipants: Boolean,
      addParticipants: Boolean,
      editProjectData: Boolean,
      manageSprints: Boolean,
      manageBacklogs: Boolean
    }
  }],
  backlogs: [ObjectId] (ref: Backlog)
}
```

#### **Tasks**
```javascript
{
  _id: ObjectId,
  name: String,
  desc: String,
  requirements: String,
  status: String ('toDo' | 'inProgress' | 'done'),
  priority: String ('low' | 'mid' | 'high'),
  difficulty: String ('low' | 'mid' | 'high'),
  projectId: ObjectId (ref: Project),
  createdBy: ObjectId (ref: User),
  executors: [ObjectId] (ref: User),
  created: Date,
  checkedDate: Date
}
```

#### **Sprints**
```javascript
{
  _id: ObjectId,
  name: String,
  goal: String,
  startDate: Date,
  endDate: Date,
  tasks: [ObjectId] (ref: Task)
}
```

### Indexes

```javascript
// Users
{ email: 1 } // unique

// Tasks
{ projectId: 1, status: 1 }
{ createdBy: 1 }
{ 'executors': 1 }

// Projects
{ owner: 1 }
{ 'participants.participant': 1 }
```

## API Design

### Authentication Flow

```
1. POST /api/auth/register
   → Create user with hashed password
   → Return JWT token

2. POST /api/auth/login
   → Validate credentials
   → Return JWT token

3. Protected routes use middleware:
   → Extract JWT from header
   → Verify and decode
   → Attach user to request
```

### RESTful Endpoints

```
Projects:
  GET    /api/user-projects
  POST   /api/project
  GET    /api/project/:id
  DELETE /api/project/:projectId

Tasks:
  GET    /api/project-tasks/:projectId
  POST   /api/task
  GET    /api/task/:taskId
  PUT    /api/task/:taskId
  DELETE /api/task/:taskId
  PATCH  /api/status/:taskId

Sprints:
  POST   /api/sprint
  GET    /api/sprints/:backlogId
  GET    /api/sprint/:sprintId
  PUT    /api/sprint/:sprintId
  DELETE /api/sprint/:sprintId

Analytics:
  POST   /api/analytics/quick-stats
  POST   /api/analytics/velocity
  POST   /api/analytics/top-contributors
  POST   /api/analytics/task-amount
  POST   /api/analytics/task-ratio
```

## Data Flow Examples

### Creating a Task

```
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│ Client  │      │ Express │      │ Service │      │ MongoDB │
└────┬────┘      └────┬────┘      └────┬────┘      └────┬────┘
     │                │                │                │
     │ POST /task     │                │                │
     ├───────────────>│                │                │
     │                │ validate JWT   │                │
     │                ├───────────────>│                │
     │                │                │ check perms    │
     │                │                ├───────────────>│
     │                │                │<───────────────┤
     │                │                │ create task    │
     │                │                ├───────────────>│
     │                │<───────────────┤                │
     │<───────────────┤                │                │
     │ 200 + task     │                │                │
```

### Calculating Velocity

```
┌─────────┐      ┌──────────┐      ┌──────────┐
│ Client  │      │ Analytics│      │ MongoDB  │
└────┬────┘      └────┬─────┘      └────┬─────┘
     │                │                  │
     │ getVelocity    │                  │
     ├───────────────>│                  │
     │                │ find backlogs    │
     │                ├─────────────────>│
     │                │<─────────────────┤
     │                │ find sprints     │
     │                ├─────────────────>│
     │                │<─────────────────┤
     │                │ for each sprint: │
     │                │   find tasks     │
     │                ├─────────────────>│
     │                │<─────────────────┤
     │                │   calc SP        │
     │                │                  │
     │<───────────────┤                  │
     │ velocity data  │                  │
```

## Security Considerations

### Authentication
- JWTs stored in localStorage (consider httpOnly cookies for production)
- Tokens expire after configurable period
- Password hashing with bcrypt (10 rounds)

### Authorization
- Every protected endpoint validates JWT
- Permission checks via MongoDB aggregation
- Owner/Rights/Creator three-tier validation

### Input Validation
- TypeScript type checking
- Mongoose schema validation
- Frontend form validation

## Performance Optimizations

### Frontend
- Code splitting by route
- Lazy loading for charts
- MobX reactive updates (only re-render when needed)
- Debounced search inputs

### Backend
- MongoDB aggregation pipelines (single query vs multiple)
- Indexed queries on frequently accessed fields
- Promise.all for parallel operations

### Database
- Compound indexes on common query patterns
- Limited result sets (pagination ready)
- Projection to return only needed fields

## Scalability Considerations

**Current State:** Single-server monolith  
**Future Improvements:**
- Separate auth service (microservices)
- Redis caching layer
- CDN for static assets
- Database sharding by project
- WebSocket for real-time updates
- Message queue for analytics calculations

## Development Workflow

```
1. Feature Branch
   └─> Development
       └─> Testing
           └─> Code Review
               └─> Main Branch
                   └─> Deployment
```

## Technology Choices Rationale

| Technology | Reason |
|------------|--------|
| React | Component reusability, large ecosystem |
| TypeScript | Type safety, better IDE support |
| MobX | Simple reactive state, less boilerplate than Redux |
| Tailwind | Rapid UI development, consistent design |
| MongoDB | Flexible schema for evolving requirements |
| Mongoose | Schema validation, easier queries |
| Express | Minimal, flexible, widely used |
| JWT | Stateless authentication, scalable |

---

This architecture supports the current feature set while remaining extensible for future enhancements like real-time collaboration, file attachments, and advanced reporting.
