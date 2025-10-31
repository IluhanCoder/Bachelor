# ⚡ Quick Start Guide

Get Backlogger running in 5 minutes!

## 🚀 Super Fast Setup (macOS)

```bash
# 1. Clone repository
git clone https://github.com/IluhanCoder/Backlogger.git
cd Backlogger

# 2. Install dependencies (both client and server)
cd server && npm install && cd ../client && npm install && cd ..

# 3. Start MongoDB (if not installed, see Database Setup below)
brew services start mongodb-community

# 4. Configure environment variables
cat > server/.env << EOF
PORT=5000
MONGO_URI=mongodb://localhost:27017/backlogger
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
CLIENT_URL=http://localhost:3000
NODE_ENV=development
EOF

# 5. Start both servers (in separate terminals)
# Terminal 1:
cd server && npm run dev

# Terminal 2:
cd client && npm start
```

**Open browser:** http://localhost:3000

**Done! 🎉**

---

## 📝 If MongoDB Not Installed

```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu)
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod

# Windows
# Download installer from https://www.mongodb.com/try/download/community
# Run installer and select "Complete" installation
# MongoDB Compass GUI will be installed automatically
```

**OR use MongoDB Atlas (Cloud - No Installation):**

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create free M0 cluster
4. Get connection string
5. Replace `MONGO_URI` in `.env` with your connection string

---

## 🎯 First Steps After Startup

### 1. Register Account
- Navigate to http://localhost:3000
- Click "Register" or "Sign Up"
- Fill in:
  - Email: your@email.com
  - Password: yourpassword
  - Name: Your Name
  - Surname: Your Surname
- Click Register

### 2. Create First Project
- Click "New Project" button
- Name: "Test Project"
- Description: "My first project"
- Click Create

### 3. Create Backlog
- Inside your project
- Click "New Backlog"
- Name: "Development"
- Click Create

### 4. Create Sprint
- Inside backlog
- Click "New Sprint"
- Name: "Sprint 1"
- Goal: "Complete core features"
- Select dates (defaults to 2 weeks)
- Click Create

### 5. Add Tasks
- Inside sprint
- Click "New Task"
- Fill in:
  - Name: "Implement login"
  - Description: "User authentication"
  - Priority: High
  - Difficulty: Medium (3 SP)
- Click Create

### 6. View Analytics
- Navigate to Analytics page
- See Quick Stats
- Check Velocity Chart
- View historical graphs

**Congratulations! You're now using Backlogger! 🎉**

---

## 🛠️ Common Commands

```bash
# Start development servers
cd server && npm run dev          # Backend on :5000
cd client && npm start            # Frontend on :3000

# Build for production
cd client && npm run build        # Creates client/build folder

# Run production
cd server && npm start            # Serves production build

# Database commands
mongosh                           # Open MongoDB shell
show dbs                          # List databases
use backlogger                    # Switch to backlogger DB
show collections                  # List collections
db.users.find()                   # View all users

# Debugging
npm run dev                       # Server with hot reload
# Check server logs in terminal
# Check browser console (F12)

# Clean install (if errors)
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Next Steps

1. **Read Documentation**
   - [README.md](README.md) - Project overview
   - [ARCHITECTURE.md](ARCHITECTURE.md) - System design
   - [API.md](API.md) - API reference
   - [FEATURES.md](FEATURES.md) - Feature details

2. **Explore Features**
   - Permission system (9 different rights)
   - Story Points tracking
   - Analytics dashboard
   - Team collaboration

3. **Customize**
   - Add your own features
   - Modify UI colors in Tailwind config
   - Extend API endpoints

4. **Contribute**
   - See [CONTRIBUTING.md](CONTRIBUTING.md)
   - Check GitHub issues
   - Submit pull requests

---

## ❓ Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or change port in server/.env
PORT=5001
```

### MongoDB Connection Error
```bash
# Check if MongoDB is running
brew services list  # macOS
sudo systemctl status mongod  # Linux

# Start if not running
brew services start mongodb-community  # macOS
sudo systemctl start mongod  # Linux

# Verify connection
mongosh mongodb://localhost:27017
```

### CORS Errors
- Verify `CLIENT_URL` in `server/.env` is `http://localhost:3000`
- Restart server after changing `.env`
- Check `server/src/app.ts` CORS configuration

### React Compilation Errors
```bash
# Clear cache
rm -rf client/node_modules/.cache
rm -rf client/build

# Reinstall
cd client
rm -rf node_modules package-lock.json
npm install
```

---

## 🎓 Learning Path

**Beginner:**
1. Understand the file structure
2. Explore React components in `client/src`
3. Check API endpoints in `server/src/router.ts`
4. Read database models in `server/src/*/[name]-types.ts`

**Intermediate:**
1. Study permission validation logic
2. Understand MongoDB aggregation pipelines
3. Explore MobX state management
4. Analyze analytics calculations

**Advanced:**
1. Implement new feature (e.g., comments on tasks)
2. Add unit tests with Jest
3. Set up CI/CD pipeline
4. Deploy to production (see [DEPLOYMENT.md](DEPLOYMENT.md))

---

## 🔗 Helpful Links

- **MongoDB Compass:** https://www.mongodb.com/products/compass (GUI for database)
- **Postman:** https://www.postman.com/ (API testing)
- **React DevTools:** https://react.dev/learn/react-developer-tools
- **MongoDB Docs:** https://www.mongodb.com/docs/
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/

---

## 💡 Pro Tips

1. **Use MongoDB Compass**
   - Visual interface for database
   - See collections and documents
   - Run queries easily

2. **Browser DevTools**
   - F12 to open
   - Network tab for API calls
   - Console for errors
   - React DevTools for component tree

3. **VS Code Extensions**
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript and JavaScript Language Features

4. **Hot Reload**
   - Client auto-reloads on save
   - Server restarts automatically (nodemon)
   - No need to manually restart

5. **Sample Data**
   - Create multiple projects
   - Add team members
   - Complete some tasks
   - View analytics with real data

---

**Need help?** Check [SETUP.md](SETUP.md) for detailed setup instructions.

**Ready to contribute?** See [CONTRIBUTING.md](CONTRIBUTING.md).

**Want to deploy?** Follow [DEPLOYMENT.md](DEPLOYMENT.md).

---

**Happy coding! 🚀**
