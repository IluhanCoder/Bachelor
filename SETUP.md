# 🛠️ Development Setup Guide

Complete guide for setting up the Backlogger development environment.

## 📋 Prerequisites

### Required Software

| Software | Minimum Version | Purpose |
|----------|----------------|---------|
| Node.js | 16.x or higher | Runtime environment |
| npm | 8.x or higher | Package manager |
| MongoDB | 5.x or higher | Database (local or Atlas) |
| Git | Any recent version | Version control |

### Recommended Tools

- **Code Editor**: Visual Studio Code
- **VS Code Extensions**:
  - ESLint
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - Prettier
  - MongoDB for VS Code
- **API Testing**: Postman or Insomnia
- **Database GUI**: MongoDB Compass

## 🚀 Initial Setup

### 1. Clone the Repository

```bash
# Clone the repo
git clone https://github.com/IluhanCoder/Backlogger.git

# Navigate to project directory
cd Backlogger
```

### 2. Database Setup

#### Option A: Local MongoDB

```bash
# Install MongoDB (macOS with Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify MongoDB is running
mongosh
# Should connect to mongodb://localhost:27017
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster (M0 free tier)
4. Configure database access:
   - Create database user with password
   - Add your IP to whitelist (or allow from anywhere: 0.0.0.0/0)
5. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`)

### 3. Environment Configuration

#### Server Environment

Create `server/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/backlogger
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/backlogger?retryWrites=true&w=majority

# JWT Secret (generate random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Client URL for CORS
CLIENT_URL=http://localhost:3000
```

**Generate JWT Secret:**
```bash
# Node.js REPL
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or online tool
# https://www.grc.com/passwords.htm
```

#### Client Environment (Optional)

Create `client/.env` if needed:

```env
# API Base URL
REACT_APP_API_URL=http://localhost:5000
```

> **Note**: By default, API URL is configured in `client/src/axios-setup.ts`

### 4. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Return to root
cd ..
```

### 5. TypeScript Configuration

Verify TypeScript configurations exist:

- `tsconfig.base.json` - Shared base config
- `server/tsconfig.json` - Server config
- `client/tsconfig.json` - Client config
- `shared/tsconfig.json` - Shared types config

No changes needed unless customizing compiler options.

## 🏃 Running the Application

### Development Mode

**Option 1: Run Both (Recommended)**

```bash
# Terminal 1 - Server (from root)
cd server
npm run dev

# Terminal 2 - Client (from root)
cd client
npm start
```

**Option 2: Concurrent Execution**

Create `package.json` in root (if not exists):

```json
{
  "scripts": {
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm start",
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\""
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

Then:
```bash
npm install  # Install concurrently
npm run dev  # Run both
```

### Production Mode

```bash
# Build client
cd client
npm run build

# Serve static files from server
# (Configure Express to serve client/build)

# Start server
cd ../server
npm start
```

## 🔍 Verification Steps

### 1. Check Server

```bash
# Should see:
# Server running on port 5000
# Connected to MongoDB

# Test endpoint
curl http://localhost:5000
# Should return server status or redirect
```

### 2. Check Client

Open browser: `http://localhost:3000`

Should see:
- Backlogger welcome page
- Login/Register forms
- No console errors

### 3. Database Connection

```bash
# Using mongosh
mongosh "mongodb://localhost:27017/backlogger"

# List collections (should be empty initially)
show collections

# After registering a user:
db.users.find()
```

### 4. Full Flow Test

1. **Register**: Create account at `/register`
2. **Login**: Sign in with credentials
3. **Create Project**: New project button
4. **Create Backlog**: Within project
5. **Create Sprint**: Within backlog
6. **Create Task**: Within sprint
7. **Check Analytics**: Navigate to analytics page

If all steps work → Setup successful! ✅

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Failed

**Problem**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions**:
```bash
# Check MongoDB is running
brew services list  # macOS
sudo systemctl status mongod  # Linux

# Restart MongoDB
brew services restart mongodb-community  # macOS
sudo systemctl restart mongod  # Linux

# Check connection string in .env
# Verify credentials for Atlas
```

#### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions**:
```bash
# Find process using port
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux

# Or change PORT in server/.env
PORT=5001
```

#### CORS Errors

**Problem**: `Access to XMLHttpRequest blocked by CORS policy`

**Solutions**:
1. Verify `CLIENT_URL` in `server/.env` matches client URL
2. Check `server/src/app.ts` CORS configuration
3. Restart server after changing .env

#### TypeScript Compilation Errors

**Problem**: `TS2307: Cannot find module`

**Solutions**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear TypeScript cache
rm -rf client/node_modules/.cache
rm -rf server/dist

# Restart VS Code TypeScript server
# CMD+Shift+P → "TypeScript: Restart TS Server"
```

#### Client Build Fails

**Problem**: `FATAL ERROR: Ineffective mark-compacts near heap limit`

**Solutions**:
```bash
# Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Or in package.json:
"scripts": {
  "build": "node --max-old-space-size=4096 node_modules/.bin/react-scripts build"
}
```

## 📁 Project Structure Overview

```
Backlogger/
├── client/                  # React frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── analytics/      # Analytics pages & components
│   │   ├── auth/           # Login/register
│   │   ├── backlogs/       # Backlog management
│   │   ├── project/        # Project CRUD
│   │   ├── sprint/         # Sprint management
│   │   ├── task/           # Task operations
│   │   ├── user/           # User profiles
│   │   ├── App.tsx         # Main app component
│   │   └── router.tsx      # Route definitions
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── analytics/      # Analytics logic
│   │   ├── auth/           # Authentication
│   │   ├── backlog/        # Backlog service
│   │   ├── projects/       # Project service
│   │   ├── sprints/        # Sprint service
│   │   ├── tasks/          # Task service
│   │   ├── user/           # User service
│   │   ├── app.ts          # Express app setup
│   │   └── router.ts       # API routes
│   └── package.json
├── shared/                 # Shared TypeScript types
│   └── types.ts
├── README.md
├── ARCHITECTURE.md
├── API.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── FEATURES.md
└── SETUP.md               # This file
```

## 🧪 Testing the API

### Using cURL

```bash
# Register user
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test",
    "surname": "User"
  }'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Copy the token from response

# Create project (replace YOUR_TOKEN)
curl -X POST http://localhost:5000/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Test Project",
    "description": "Testing API"
  }'
```

### Using Postman

1. Import collection (create new):
   - Create folder "Auth"
     - POST `/auth/register`
     - POST `/auth/login`
   - Create folder "Projects"
     - GET `/projects/user-projects`
     - POST `/projects`
     - GET `/projects/:id`

2. Set environment variable:
   - Variable: `baseUrl`
   - Initial Value: `http://localhost:5000`
   - Variable: `token`
   - Use `{{token}}` in Authorization headers

3. Setup auth:
   - After login, extract token from response
   - Set as environment variable
   - Use in other requests: `Bearer {{token}}`

## 🔧 Development Workflow

### 1. Feature Development

```bash
# Create feature branch
git checkout -b feature/task-comments

# Make changes
# ... coding ...

# Test locally
npm run dev

# Commit with conventional commits
git commit -m "feat: add task comments functionality"

# Push branch
git push origin feature/task-comments

# Create pull request on GitHub
```

### 2. Code Style

Follow guidelines in `CONTRIBUTING.md`:

- Use TypeScript types
- Follow naming conventions
- Add comments for complex logic
- Format with Prettier
- Lint with ESLint

### 3. Database Migrations

For schema changes:

```javascript
// Example: Adding new field to Task model

// 1. Update server/src/tasks/task-types.ts
export interface ITask {
  // ... existing fields
  estimatedHours?: number;  // NEW FIELD
}

// 2. Update Mongoose model if needed
// server/src/tasks/task-model.ts

// 3. No migration needed for MongoDB (schemaless)
// New field will be added as tasks are updated

// 4. Handle in service layer
// Set default if field missing in old documents
```

## 🎓 Learning Resources

**TypeScript**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

**React**
- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [MobX](https://mobx.js.org/)

**Node.js & Express**
- [Express.js Guide](https://expressjs.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

**MongoDB**
- [MongoDB Manual](https://www.mongodb.com/docs/manual/)
- [Mongoose Docs](https://mongoosejs.com/docs/)

**Tailwind CSS**
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)

## 💡 Tips for Development

1. **Use VS Code Debugging**
   - Set breakpoints in TypeScript files
   - Use launch configurations for client/server
   - Inspect variables and call stack

2. **Monitor Network Requests**
   - Open browser DevTools (F12)
   - Check Network tab for API calls
   - Verify request/response data

3. **Database Inspection**
   - Use MongoDB Compass GUI
   - Or mongosh for quick queries
   - Create indexes for performance

4. **Hot Reload**
   - Client auto-reloads on save
   - Server uses nodemon (restart on changes)
   - No need to manually restart

5. **Error Handling**
   - Check both browser console and terminal
   - Server logs errors with stack traces
   - Use try-catch in async operations

## 🚀 Next Steps

After setup:

1. ✅ Read `ARCHITECTURE.md` to understand system design
2. ✅ Review `API.md` for endpoint documentation
3. ✅ Check `FEATURES.md` for functionality overview
4. ✅ Follow `CONTRIBUTING.md` for development guidelines
5. ✅ Start with small feature or bug fix
6. ✅ Create issues for bugs or feature ideas

---

**Need Help?**

- Check existing issues on GitHub
- Review documentation files
- Contact: IluhanCoder

**Happy Coding! 🎉**
