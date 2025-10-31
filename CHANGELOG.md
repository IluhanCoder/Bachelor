# 📜 Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-10-31

### 🌍 Internationalization Update

#### ✨ Changed

**Complete English Translation:**
- Translated entire UI from Ukrainian to English
- Updated all component labels, buttons, and placeholders
- Translated form fields and validation messages
- Updated analytics dashboard labels and chart titles
- Internationalized date picker (month names: Jan, Feb, Mar...)
- Translated all status and priority labels
- Updated navigation and page headers
- Converted all confirmation dialogs to English

**UI/UX Improvements:**
- Replaced text action buttons with intuitive icons:
  - 🗑️ Delete icon for removal actions
  - ✏️ Edit icon for modification actions
- Enhanced visual consistency across the application
- Improved accessibility with clear English labels
- Better internationalization foundation for future languages

**Documentation Updates:**
- Updated FEATURES.md to reflect English UI
- Modified README.md to note full English interface
- Corrected date localization descriptions

#### 🔧 Technical Changes

**Frontend Components Updated:**
- All React components in `client/src/`:
  - Analytics module (charts, stats, date picker)
  - Authentication pages (login, registration)
  - Project management (projects, backlogs)
  - Task management (forms, boards, mappers)
  - Sprint management (forms, mappers)
  - Rights management interface
  - Navigation headers
  - User profile pages
  - Invitation system

**Translation Coverage:**
- ~95% of user-facing text translated
- Comprehensive coverage of:
  - Page titles and headers
  - Form labels and placeholders
  - Button text and actions
  - Status indicators
  - Empty states and messages
  - Chart labels and tooltips
  - Navigation links
  - Confirmation dialogs

#### 📝 Notes

- Application now fully ready for international portfolio presentation
- Server-side validation messages already in English
- Foundation laid for future multi-language support
- Icon-based actions improve usability across language barriers

---

## [1.0.0] - 2024-10-31

### 🎉 Initial Release

#### ✨ Added

**Core Features:**
- User authentication system with JWT
- Project creation and management
- Backlog organization system
- Sprint planning with date ranges
- Kanban board with three-column layout (To Do, In Progress, Done)
- Task creation with rich details (description, requirements, priority, difficulty)
- Task assignment to multiple executors
- Story Points system based on difficulty (1 SP, 3 SP, 5 SP)

**Permission System:**
- Granular 9-permission system:
  - Create tasks
  - Edit tasks
  - Delete tasks
  - Change task status
  - Add participants
  - Edit participants
  - Edit project data
  - Manage sprints
  - Manage backlogs
- Three-tier permission validation (Owner → Rights → Creator)
- Project ownership transfer with automatic rights preservation

**Analytics Dashboard:**
- Quick Stats Cards showing:
  - Total tasks count
  - Completed/In Progress/To Do breakdown
  - Total and completed Story Points
  - Team size and average workload
  - Completion rate percentage
- Velocity Chart displaying Story Points per sprint
- Top Contributors leaderboard with medals
- Historical graphs:
  - Tasks created over time
  - Tasks completed over time
  - Completion ratio tracking
  - Predictive analysis using linear regression
- Customizable date range filtering
- Daily/monthly view toggle
- Personal vs team statistics toggle

**User Interface:**
- Modern gradient-based design with Tailwind CSS
- Responsive layout for all screen sizes
- Custom date picker with English month names
- Avatar system with base64 image upload
- Interactive charts using Recharts
- Modal forms with click-outside close
- Loading states and empty state messages
- Hover effects and smooth transitions
- Color-coded priority and difficulty badges
- Icon-based action buttons for better UX

**Team Collaboration:**
- User invitation system
- Participant management
- Rights assignment per user
- User profiles with customizable information
- User search and filtering

#### 🛠️ Technical Implementation

**Frontend:**
- React 18 with TypeScript
- MobX for state management
- React Router for navigation
- Axios for API calls
- Custom hooks for data fetching
- Component-based architecture
- Shared styles and reusable components

**Backend:**
- Node.js with Express
- TypeScript for type safety
- MongoDB with Mongoose ODM
- JWT authentication middleware
- Complex MongoDB aggregation pipelines
- Permission validation at service layer
- RESTful API design
- CORS configuration

**Database:**
- Optimized indexes for common queries
- Referential integrity with ObjectIds
- Embedded documents for participants/rights
- Date-based filtering support

#### 📝 Documentation

- Comprehensive README with features overview
- Architecture documentation
- API documentation with examples
- Contributing guidelines
- Code comments for complex logic

---

## [Unreleased]

### 🚀 Planned Features

**High Priority:**
- [ ] Real-time updates with WebSockets
- [ ] File attachments for tasks
- [ ] Comments/activity feed per task
- [ ] Email notifications for assignments
- [ ] Drag-and-drop task reordering
- [ ] Mobile app (React Native)

**Medium Priority:**
- [ ] Advanced sprint reports (burndown charts)
- [ ] Task templates
- [ ] Bulk operations (multi-select tasks)
- [ ] Export to CSV/PDF
- [ ] Dark mode
- [ ] Calendar view for sprints
- [ ] Task dependencies
- [ ] Time tracking

**Low Priority:**
- [ ] Integrations (GitHub, Slack, etc.)
- [ ] Custom fields per project
- [ ] Task labels/tags system
- [ ] Recurring tasks
- [ ] Archive completed projects
- [ ] Public project sharing (read-only)

### 🐛 Known Issues

- Avatar upload limited to base64 (no file size limit - needs improvement)
- No pagination for large task lists
- Date picker doesn't block past dates in edit mode
- No confirmation dialogs for destructive actions
- Search is case-sensitive

### 💡 Ideas for Future

- AI-powered task estimation
- Automated sprint planning suggestions
- Slack/Discord bot integration
- Browser extension for quick task creation
- Two-factor authentication
- SSO integration (Google, GitHub)
- Multi-language support
- Customizable workflows beyond To Do/In Progress/Done

---

## Version History Summary

| Version | Release Date | Key Features |
|---------|--------------|--------------|
| 1.1.0   | 2024-10-31   | Full English translation, icon-based actions, improved UX |
| 1.0.0   | 2024-10-31   | Initial release with core PM features, analytics, permissions |

---

## Migration Notes

### Upgrading to 1.0.0

This is the initial release, no migration needed.

For future versions, breaking changes and migration steps will be documented here.

---

## Credits

**Developed by:** Illia Koval (IluhanCoder)

**Technologies:** React, TypeScript, Node.js, MongoDB, Tailwind CSS

**Inspired by:** Jira, Linear, Trello

---

**Last Updated:** October 31, 2024
