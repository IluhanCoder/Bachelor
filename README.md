# 📋 Backlogger - Advanced Project Management System

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)
![Version](https://img.shields.io/badge/version-1.1.0-green.svg?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)

</div>

> A comprehensive Agile project management platform with Story Points tracking, advanced analytics, and granular permission control.

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Core Concepts](#-core-concepts)
- [Analytics](#-analytics)
- [Security](#-security)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

## 🌟 Overview

Backlogger is a full-stack web application designed for modern software development teams following Agile methodologies. It provides powerful tools for sprint planning, task management, team collaboration, and performance analytics.

## ✨ Key Features

### 📊 **Project & Task Management**
- **Kanban Board** - Visual task management with drag-and-drop functionality
- **Sprint Planning** - Create and manage sprints with customizable timelines
- **Backlog Organization** - Organize tasks into multiple backlogs
- **Story Points System** - Task estimation using difficulty levels (1, 3, 5 SP)
- **Task Prioritization** - High, Medium, Low priority levels with automatic sorting
- **Status Tracking** - To Do → In Progress → Done workflow

### 👥 **Team Collaboration**
- **User Management** - Invite team members with email notifications
- **Role-Based Access Control** - 9 granular permission types:
  - Create tasks
  - Edit tasks
  - Delete tasks
  - Change task status (check)
  - Add participants
  - Edit participants
  - Edit project data
  - Manage sprints
  - Manage backlogs
- **Task Assignment** - Assign multiple executors to tasks
- **Project Ownership** - Transfer ownership with automatic rights preservation

### 📈 **Advanced Analytics**
- **Quick Stats Dashboard** - Real-time project overview with 6 key metrics
- **Velocity Chart** - Story Points completion tracking across sprints
- **Top Contributors** - Leaderboard showing team performance
- **Historical Graphs**:
  - Tasks created over time
  - Tasks completed over time
  - Completion ratio tracking
  - Predictive analysis using linear regression
- **Customizable Filters** - Daily/monthly views, personal/team statistics

### 🎨 **Modern UI/UX**
- Responsive design with Tailwind CSS
- Gradient backgrounds and smooth animations
- Interactive charts and visualizations
- Avatar system with custom images
- Fully internationalized English interface
- Icon-based actions for intuitive UX
- Empty states and loading indicators

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **MobX** - State management
- **Recharts** - Data visualization
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React DatePicker** - Date selection

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **ML-Regression** - Predictive analytics

### Development Tools
- **ESLint** - Code linting
- **Nodemon** - Auto-restart during development
- **CORS** - Cross-origin resource sharing

## 🏗️ Architecture

```
Backlogger/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── analytics/     # Analytics & charts
│   │   ├── auth/          # Authentication
│   │   ├── backlogs/      # Backlog management
│   │   ├── errors/        # Error handling
│   │   ├── forms/         # Form components
│   │   ├── invite/        # Team invitations
│   │   ├── misc/          # Utilities
│   │   ├── project/       # Project management
│   │   ├── sprint/        # Sprint management
│   │   ├── task/          # Task management
│   │   ├── user/          # User profiles
│   │   └── styles/        # Shared styles
│   └── public/
├── server/                # Express Backend
│   └── src/
│       ├── analytics/     # Analytics service
│       ├── auth/          # JWT authentication
│       ├── backlog/       # Backlog CRUD
│       ├── invites/       # Invitation system
│       ├── projects/      # Project CRUD
│       ├── sprints/       # Sprint CRUD
│       ├── tasks/         # Task CRUD & permissions
│       └── user/          # User management
└── shared/                # Shared TypeScript types
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/IluhanCoder/Bachelor.git
cd Bachelor
```

2. **Install dependencies**
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. **Environment Setup**

Create `.env` file in the server directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
```

4. **Run the application**

Terminal 1 - Start backend:
```bash
cd server
npm run dev
```

Terminal 2 - Start frontend:
```bash
cd client
npm start
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## 📚 Core Concepts

### Story Points System
Tasks are estimated using difficulty levels:
- **Low (1 SP)** - Simple tasks, quick to complete
- **Medium (3 SP)** - Standard complexity tasks
- **High (5 SP)** - Complex tasks requiring significant effort

### Permission Tiers
1. **Owner** - Full control over project
2. **Specific Rights** - Granular permissions per participant
3. **Creator Rights** - Task creator can edit/delete their own tasks

### Sprint Workflow
1. Create sprint with start/end dates and goal
2. Add tasks from backlog to sprint
3. Team works on tasks, updating status
4. Track progress via Story Points completion
5. Review velocity and adjust future planning

## 🎯 Use Cases

- **Software Development Teams** - Agile sprint planning and tracking
- **Product Management** - Feature prioritization and roadmap planning
- **Remote Teams** - Collaborative task management
- **Analytics & Reporting** - Performance metrics and trend analysis
- **Portfolio Projects** - Demonstrating full-stack development skills

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes with middleware
- Role-based access control
- Input validation and sanitization

## 📊 Analytics Features Explained

### Quick Stats
Real-time overview showing:
- Total tasks in project
- Completed vs in-progress vs todo
- Total and completed Story Points
- Team size and average workload
- Overall completion rate

### Velocity Chart
Visualizes Story Points completed per sprint, helping teams:
- Estimate future sprint capacity
- Identify productivity trends
- Balance workload across sprints

### Top Contributors
Gamified leaderboard showing:
- Tasks completed
- Story Points achieved
- Current workload
- Team rankings

## 📚 Documentation

Comprehensive documentation is available to help you understand, use, and contribute to Backlogger:

| Document | Description |
|----------|-------------|
| [📖 Documentation Index](DOCS_INDEX.md) | Complete guide to all documentation |
| [⚡ Quick Start](QUICKSTART.md) | Get running in 5 minutes |
| [🛠️ Setup Guide](SETUP.md) | Detailed development environment setup |
| [🏗️ Architecture](ARCHITECTURE.md) | System design and technical deep-dive |
| [🔌 API Reference](API.md) | Complete API endpoint documentation |
| [✨ Features](FEATURES.md) | Detailed feature descriptions and use cases |
| [🤝 Contributing](CONTRIBUTING.md) | Contribution guidelines and code style |
| [🚀 Deployment](DEPLOYMENT.md) | Production deployment checklist |
| [🎤 Presentation](PRESENTATION.md) | Demo scripts and interview preparation |
| [📜 Changelog](CHANGELOG.md) | Version history and roadmap |

**👉 New to the project?** Start with the [Documentation Index](DOCS_INDEX.md)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 

Please check the [Contributing Guidelines](CONTRIBUTING.md) before making any changes.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Illia Koval (IluhanCoder)**
- GitHub: [@IluhanCoder](https://github.com/IluhanCoder)
- Repository: [Backlogger](https://github.com/IluhanCoder/Backlogger)
- Portfolio: [Coming Soon]

## 🙏 Acknowledgments

- Inspired by modern PM tools like Jira, Trello, and Linear
- Built to demonstrate full-stack development expertise
- Designed to showcase:
  - Complex state management
  - Advanced database operations
  - Permission system architecture
  - Data analytics and visualization
  - Modern UI/UX patterns

## 🌟 Show Your Support

If you find this project helpful or interesting, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs or suggesting features
- 🤝 Contributing to the codebase
- 📢 Sharing with others

---

**Made with ❤️ using React, TypeScript, Node.js, and MongoDB**

*Version 1.1.0 - October 2024*
