# 📡 API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: [Your deployment URL]/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Register New User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John",
  "surname": "Doe",
  "nickname": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "organisation": "Tech Corp"
}

Response: 200 OK
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ...userObject }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response: 200 OK
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ...userObject }
}
```

## Projects

### Get User Projects
```http
GET /user-projects
Authorization: Bearer <token>

Response: 200 OK
{
  "status": "success",
  "projects": [...]
}
```

### Create Project
```http
POST /project
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Awesome Project"
}

Response: 200 OK
{
  "status": "success",
  "project": { ...projectObject }
}
```

### Get Project Details
```http
GET /project/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "status": "success",
  "project": {
    "_id": "...",
    "name": "Project Name",
    "owner": { ...ownerObject },
    "participants": [...],
    "backlogs": [...]
  }
}
```

### Delete Project
```http
DELETE /project/:projectId
Authorization: Bearer <token>

Response: 200 OK
{
  "status": "success"
}
```

## Tasks

### Get Project Tasks
```http
GET /project-tasks/:projectId
Authorization: Bearer <token>

Response: 200 OK
{
  "status": "success",
  "tasks": [
    {
      "_id": "...",
      "name": "Task Name",
      "desc": "Description",
      "status": "toDo",
      "priority": "high",
      "difficulty": "mid",
      "executors": [...],
      "createdBy": {...},
      "created": "2024-10-31T..."
    }
  ]
}
```

### Create Task
```http
POST /task
Authorization: Bearer <token>
Content-Type: application/json

{
  "task": {
    "backlogId": "...",
    "createdBy": "...",
    "name": "Implement feature X",
    "desc": "Detailed description",
    "requirements": "Must have tests",
    "priority": "high",
    "difficulty": "mid"
  }
}

Response: 200 OK
{
  "status": "success"
}
```

### Update Task
```http
PUT /task/:taskId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated task name",
  "desc": "Updated description",
  "requirements": "New requirements",
  "priority": "low",
  "difficulty": "high"
}

Response: 200 OK
{
  "status": "success"
}
```

### Change Task Status
```http
PATCH /status/:taskId
Authorization: Bearer <token>
Content-Type: application/json

{
  "newStatus": "inProgress"
}

Response: 200 OK
{
  "status": "success"
}
```

### Assign Task
```http
PATCH /assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "taskId": "...",
  "userId": "..."
}

Response: 200 OK
{
  "status": "success"
}
```

### Delete Task
```http
DELETE /task/:taskId
Authorization: Bearer <token>

Response: 200 OK
{
  "status": "success"
}
```

## Sprints

### Create Sprint
```http
POST /sprint
Authorization: Bearer <token>
Content-Type: application/json

{
  "backlogId": "...",
  "name": "Sprint 1",
  "goal": "Implement core features",
  "startDate": "2024-11-01T00:00:00Z",
  "endDate": "2024-11-14T23:59:59Z"
}

Response: 200 OK
{
  "status": "success"
}
```

### Get Backlog Sprints
```http
GET /sprints/:backlogId
Authorization: Bearer <token>

Response: 200 OK
{
  "status": "success",
  "sprints": [
    {
      "_id": "...",
      "name": "Sprint 1",
      "goal": "...",
      "startDate": "...",
      "endDate": "...",
      "tasks": [...]
    }
  ]
}
```

### Update Sprint
```http
PUT /sprint/:sprintId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Sprint Name",
  "goal": "New goal",
  "startDate": "2024-11-01T00:00:00Z",
  "endDate": "2024-11-14T23:59:59Z"
}

Response: 200 OK
{
  "status": "success"
}
```

### Add Task to Sprint
```http
POST /sprint-task
Authorization: Bearer <token>
Content-Type: application/json

{
  "taskId": "...",
  "sprintId": "..."
}

Response: 200 OK
{
  "status": "success"
}
```

### Remove Task from Sprint
```http
POST /sprint-pull-task
Authorization: Bearer <token>
Content-Type: application/json

{
  "taskId": "...",
  "sprintId": "..."
}

Response: 200 OK
{
  "status": "success"
}
```

### Delete Sprint
```http
DELETE /sprint/:sprintId
Authorization: Bearer <token>

Response: 200 OK
{
  "status": "success"
}
```

## Backlogs

### Get Project Backlogs
```http
GET /backlogs/:projectId
Authorization: Bearer <token>

Response: 200 OK
{
  "status": "success",
  "backlogs": [...]
}
```

### Create Backlog
```http
POST /backlog/:projectId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Feature Backlog"
}

Response: 200 OK
{
  "status": "success"
}
```

### Get Backlog Tasks
```http
GET /backlog-tasks/:backlogId
Authorization: Bearer <token>

Response: 200 OK
{
  "status": "success",
  "tasks": [...]
}
```

## Analytics

### Quick Stats
```http
POST /analytics/quick-stats
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "...",
  "userId": "..." // optional - for personal stats
}

Response: 200 OK
{
  "status": "success",
  "result": {
    "totalTasks": 50,
    "completedTasks": 30,
    "inProgressTasks": 15,
    "todoTasks": 5,
    "totalStoryPoints": 120,
    "completedStoryPoints": 75,
    "teamSize": 5,
    "avgTasksPerMember": 10.0,
    "completionRate": 60.0
  }
}
```

### Velocity Data
```http
POST /analytics/velocity
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "..."
}

Response: 200 OK
{
  "status": "success",
  "result": [
    {
      "sprintName": "Sprint 1",
      "sprintId": "...",
      "storyPoints": 25,
      "completedStoryPoints": 20,
      "completionRate": 80,
      "startDate": "...",
      "endDate": "..."
    }
  ]
}
```

### Top Contributors
```http
POST /analytics/top-contributors
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "..."
}

Response: 200 OK
{
  "status": "success",
  "result": [
    {
      "userId": "...",
      "userName": "John Doe",
      "completedTasks": 15,
      "completedStoryPoints": 45,
      "inProgressTasks": 3,
      "totalTasks": 18
    }
  ]
}
```

### Task Creation Analytics
```http
POST /analytics/created-task-amount
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "...",
  "startDate": "2024-10-01T00:00:00Z",
  "endDate": "2024-10-31T23:59:59Z",
  "daily": false,
  "userId": "..." // optional
}

Response: 200 OK
{
  "status": "success",
  "result": [
    {
      "month": 10,
      "year": 2024,
      "amount": 25
    }
  ]
}
```

### Task Completion Analytics
```http
POST /analytics/task-amount
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "...",
  "startDate": "2024-10-01T00:00:00Z",
  "endDate": "2024-10-31T23:59:59Z",
  "isDaily": false,
  "userId": "..." // optional
}

Response: 200 OK
{
  "status": "success",
  "result": [...]
}
```

### Completion Ratio
```http
POST /analytics/task-ratio
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "...",
  "startDate": "2024-10-01T00:00:00Z",
  "endDate": "2024-10-31T23:59:59Z",
  "daily": false,
  "userId": "..." // optional
}

Response: 200 OK
{
  "status": "success",
  "result": [
    {
      "month": 10,
      "year": 2024,
      "amount": 75.5 // percentage
    }
  ]
}
```

### Predictive Analysis
```http
POST /analytics/predict-ratio
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "...",
  "userId": "..." // optional
}

Response: 200 OK
{
  "status": "success",
  "result": [
    {
      "month": 11,
      "year": 2024,
      "amount": 78.2 // predicted percentage
    }
  ]
}
```

## Permissions

### Get User Rights
```http
GET /user-rights/:projectId
Authorization: Bearer <token>

Response: 200 OK
{
  "status": "success",
  "rights": {
    "create": true,
    "edit": true,
    "delete": false,
    "check": true,
    "editParticipants": false,
    "addParticipants": true,
    "editProjectData": false,
    "manageSprints": true,
    "manageBacklogs": false
  }
}
```

### Set Participant Rights
```http
PATCH /rights/:projectId
Authorization: Bearer <token>
Content-Type: application/json

{
  "participantId": "...",
  "rights": {
    "create": true,
    "edit": true,
    "delete": false,
    // ... all 9 rights
  }
}

Response: 200 OK
{
  "status": "success"
}
```

### Transfer Ownership
```http
POST /owner/:projectId
Authorization: Bearer <token>
Content-Type: application/json

{
  "newOwnerId": "..."
}

Response: 200 OK
{
  "status": "success"
}
```

## Invitations

### Create Invitation
```http
POST /invite
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "...",
  "invitedId": "..."
}

Response: 200 OK
{
  "status": "success"
}
```

### Get User's Invitations
```http
GET /invites-to-user
Authorization: Bearer <token>

Response: 200 OK
{
  "status": "success",
  "invites": [...]
}
```

### Accept Invitation
```http
POST /see-invite/:inviteId
Authorization: Bearer <token>

Response: 200 OK
{
  "status": "success"
}
```

### Cancel Invitation
```http
POST /cancel-invite
Authorization: Bearer <token>
Content-Type: application/json

{
  "inviteId": "..."
}

Response: 200 OK
{
  "status": "success"
}
```

## Error Responses

All errors follow this format:

```json
{
  "status": "fail",
  "message": "Error description"
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (invalid data) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

## Rate Limiting

Currently no rate limiting implemented. Consider adding for production deployment.

## CORS

Configured to accept requests from:
- Development: `http://localhost:3000`
- Production: Configure `CLIENT_URL` in environment variables

---

**Note:** This API is designed for educational/portfolio purposes. For production use, consider adding:
- Input validation middleware
- Rate limiting
- Request logging
- API versioning (/api/v1/...)
- Comprehensive error handling
- Request/response compression
