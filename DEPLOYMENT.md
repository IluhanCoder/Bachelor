# 🚀 Deployment Checklist

Complete checklist for deploying Backlogger to production.

## 📋 Pre-Deployment Checklist

### Code Quality
- [x] All console.log statements removed
- [x] No TypeScript compilation errors
- [x] No ESLint warnings (critical ones)
- [x] Proper error handling in all endpoints
- [x] Environment variables properly configured
- [ ] Security vulnerabilities checked (`npm audit`)
- [ ] Dependencies up to date (`npm outdated`)

### Documentation
- [x] README.md complete
- [x] ARCHITECTURE.md created
- [x] API.md documented
- [x] CONTRIBUTING.md guidelines
- [x] CHANGELOG.md initialized
- [x] LICENSE file added
- [ ] Screenshots added to README
- [ ] Demo video created and linked

### Testing
- [ ] Manual testing of all features
- [ ] Registration and login flow
- [ ] Project/backlog/sprint creation
- [ ] Task CRUD operations
- [ ] Permission system validation
- [ ] Analytics calculations
- [ ] Mobile responsiveness
- [ ] Cross-browser testing (Chrome, Firefox, Safari)

### Security
- [ ] Environment variables not committed
- [ ] JWT secret is strong (64+ chars)
- [ ] MongoDB credentials secure
- [ ] CORS properly configured
- [ ] Password hashing verified (bcrypt)
- [ ] SQL injection prevention (using Mongoose)
- [ ] XSS prevention (React escapes by default)
- [ ] Rate limiting considered (optional)

## 🗄️ Database Setup

### MongoDB Atlas Configuration

- [ ] Create MongoDB Atlas account
- [ ] Create new cluster (M0 free tier or higher)
- [ ] Configure database access:
  - [ ] Create admin user with strong password
  - [ ] Save credentials securely
- [ ] Configure network access:
  - [ ] Add IP whitelist (0.0.0.0/0 for all, or specific IPs)
- [ ] Get connection string
- [ ] Test connection locally with new string
- [ ] Create database `backlogger` (auto-created on first write)
- [ ] Verify indexes are created automatically

**Connection String Format:**
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/backlogger?retryWrites=true&w=majority
```

### Database Backup Plan
- [ ] Enable automated backups in Atlas
- [ ] Export sample data for testing
- [ ] Document restore procedure

## 🖥️ Backend Deployment

### Option 1: Railway (Recommended)

**Setup:**
1. [ ] Create Railway account (https://railway.app)
2. [ ] Install Railway CLI: `npm install -g @railway/cli`
3. [ ] Login: `railway login`
4. [ ] Initialize project: `railway init`
5. [ ] Link to GitHub repository (recommended)

**Configuration:**
```bash
# From server directory
cd server

# Set environment variables
railway variables set MONGO_URI="mongodb+srv://..."
railway variables set JWT_SECRET="your_64_char_secret"
railway variables set CLIENT_URL="https://your-frontend.vercel.app"
railway variables set NODE_ENV="production"

# Deploy
railway up
```

**Post-Deploy:**
- [ ] Copy Railway URL (e.g., `https://backlogger-server.railway.app`)
- [ ] Test API: `curl https://your-url.railway.app/`
- [ ] Check logs: `railway logs`
- [ ] Set up custom domain (optional)

### Option 2: Render

**Setup:**
1. [ ] Create Render account (https://render.com)
2. [ ] New Web Service → Connect GitHub repo
3. [ ] Configure:
   - **Name:** backlogger-server
   - **Environment:** Node
   - **Build Command:** `cd server && npm install && npm run build`
   - **Start Command:** `cd server && npm start`
   - **Branch:** main

**Environment Variables:**
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_here
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
PORT=5000
```

**Post-Deploy:**
- [ ] Wait for build to complete (~5 minutes)
- [ ] Copy Render URL
- [ ] Test API endpoint
- [ ] Enable auto-deploy on push (optional)

### Option 3: Heroku

**Setup:**
```bash
# Install Heroku CLI
brew tap heroku/brew && brew install heroku  # macOS

# Login
heroku login

# Create app
heroku create backlogger-server

# Set environment variables
heroku config:set MONGO_URI="mongodb+srv://..."
heroku config:set JWT_SECRET="your_secret"
heroku config:set CLIENT_URL="https://your-frontend.vercel.app"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

**Post-Deploy:**
- [ ] Copy Heroku URL: `https://backlogger-server.herokuapp.com`
- [ ] Test endpoint
- [ ] Set up monitoring

### Verify Backend Deployment
```bash
# Test root endpoint
curl https://your-backend-url.com/

# Test auth endpoint
curl -X POST https://your-backend-url.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test","surname":"User"}'
```

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended for React)

**Setup:**
1. [ ] Create Vercel account (https://vercel.com)
2. [ ] Install Vercel CLI: `npm install -g vercel`
3. [ ] Login: `vercel login`

**Deploy:**
```bash
# From client directory
cd client

# First deployment (interactive)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your username
# - Link to existing project? No
# - Project name? backlogger
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

**Configuration:**
- [ ] Update `client/src/axios-setup.ts`:
```typescript
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://your-backend-url.railway.app',
  withCredentials: true
});
```

- [ ] Add environment variable in Vercel dashboard:
  - `REACT_APP_API_URL=https://your-backend-url.railway.app`

**Post-Deploy:**
- [ ] Copy Vercel URL: `https://backlogger.vercel.app`
- [ ] Test full registration/login flow
- [ ] Update backend CORS to allow Vercel URL
- [ ] Set up custom domain (optional)

### Option 2: Netlify

**Setup:**
1. [ ] Create Netlify account (https://netlify.com)
2. [ ] New site from Git → Select repository
3. [ ] Configure:
   - **Base directory:** client
   - **Build command:** `npm run build`
   - **Publish directory:** client/build
   - **Environment variables:** `REACT_APP_API_URL=https://your-backend.railway.app`

**Post-Deploy:**
- [ ] Copy Netlify URL
- [ ] Test application
- [ ] Set up continuous deployment

### Verify Frontend Deployment
- [ ] Open production URL in browser
- [ ] Test registration
- [ ] Test login
- [ ] Create project
- [ ] Create sprint
- [ ] View analytics
- [ ] Check all links work
- [ ] Verify images/icons load
- [ ] Test on mobile device
- [ ] Test in incognito mode

## 🔗 Integration & Testing

### Connect Frontend to Backend
- [ ] Update backend CORS configuration:
```typescript
// server/src/app.ts
const allowedOrigins = [
  'http://localhost:3000',
  'https://backlogger.vercel.app',  // Add your frontend URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

- [ ] Redeploy backend with updated CORS
- [ ] Test API calls from frontend

### End-to-End Testing
- [ ] User Registration
  - Email validation
  - Password strength
  - Duplicate user handling
- [ ] User Login
  - Correct credentials
  - Wrong password handling
  - JWT token storage
- [ ] Project Management
  - Create project
  - Edit project
  - Delete project (owner only)
  - Transfer ownership
- [ ] Sprint Operations
  - Create sprint with dates
  - Edit sprint
  - Complete sprint
  - Delete sprint
- [ ] Task Management
  - Create task with all fields
  - Edit task
  - Assign/unassign users
  - Change status (drag-and-drop if implemented)
  - Delete task
- [ ] Analytics
  - View quick stats
  - Check velocity chart
  - Verify top contributors
  - Toggle date ranges
  - Personal vs team toggle
- [ ] Permissions
  - Test each of 9 permissions
  - Verify owner always has access
  - Check creator can edit own tasks
  - Ensure non-permitted users blocked

## 📱 Post-Deployment

### Update Documentation
- [ ] Add "🚀 Live Demo" section to README:
```markdown
## 🚀 Live Demo

**Frontend:** [https://backlogger.vercel.app](https://backlogger.vercel.app)
**API:** [https://backlogger-server.railway.app](https://backlogger-server.railway.app)

### Demo Account
- **Email:** demo@backlogger.com
- **Password:** demo123

*Feel free to explore all features! The database resets daily.*
```

- [ ] Update README badges with deployment status
- [ ] Add screenshots to README
- [ ] Link demo video

### Monitoring & Maintenance
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure uptime monitoring (UptimeRobot)
- [ ] Set up analytics (Google Analytics, Mixpanel)
- [ ] Create backup script for MongoDB
- [ ] Document rollback procedure
- [ ] Set up alerts for server errors

### Performance Optimization
- [ ] Enable gzip compression
- [ ] Optimize images (use WebP)
- [ ] Implement lazy loading
- [ ] Add caching headers
- [ ] CDN for static assets (optional)
- [ ] Database query optimization
- [ ] Add indexes for frequent queries

### SEO (Optional)
- [ ] Add meta tags to index.html
- [ ] Create sitemap.xml
- [ ] Add robots.txt
- [ ] Open Graph tags for social sharing
- [ ] Favicon properly set

## 🎉 Launch Checklist

### Before Going Public
- [ ] All critical bugs fixed
- [ ] All features working as expected
- [ ] Documentation complete
- [ ] Demo video recorded
- [ ] Screenshots captured
- [ ] Social media graphics created
- [ ] Privacy policy (if collecting data)
- [ ] Terms of service (optional)

### Announcement Plan
- [ ] Post on LinkedIn with demo link
- [ ] Share on Twitter/X with screenshots
- [ ] Add to portfolio website
- [ ] Update resume with live link
- [ ] Share in developer communities (dev.to, Reddit)
- [ ] Add to GitHub profile README

### GitHub Repository Polish
- [ ] Add topics/tags to repo
- [ ] Create GitHub social preview image (1280x640)
- [ ] Pin repository on profile
- [ ] Add shields/badges to README
- [ ] Create GitHub Project board (optional)
- [ ] Enable Discussions (optional)

## 🐛 Common Deployment Issues

### Issue: CORS Errors
**Solution:**
- Verify `CLIENT_URL` environment variable on backend
- Check CORS configuration includes frontend URL
- Ensure credentials: true in both axios and CORS

### Issue: Database Connection Failed
**Solution:**
- Verify MongoDB Atlas IP whitelist (0.0.0.0/0)
- Check connection string format
- Ensure database user has read/write permissions
- Test connection string locally first

### Issue: Build Fails
**Solution:**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Environment Variables Not Working
**Solution:**
- Restart deployment platform after adding variables
- Check variable names match exactly (case-sensitive)
- For React: must start with `REACT_APP_`
- Rebuild frontend after adding variables

### Issue: API Returns 502/504
**Solution:**
- Check server logs for errors
- Verify start command is correct
- Ensure PORT environment variable used
- Check memory/CPU limits on hosting platform

## 📊 Success Criteria

Deployment is successful when:
- ✅ Frontend accessible at public URL
- ✅ Backend accessible and responding
- ✅ Full user flow works (register → login → create project → analytics)
- ✅ Database operations persist
- ✅ No CORS errors
- ✅ No console errors in browser
- ✅ Works on mobile devices
- ✅ Fast load times (< 3 seconds)
- ✅ SSL certificate active (HTTPS)
- ✅ Documentation updated with live URLs

## 🎯 Next Steps After Deployment

1. **Share Your Work**
   - Social media posts
   - Portfolio update
   - Resume link update

2. **Gather Feedback**
   - Share with developer friends
   - Post in communities
   - User testing with real teams

3. **Iterate**
   - Fix reported bugs
   - Add requested features
   - Improve performance

4. **Monitor**
   - Check error logs daily
   - Monitor uptime
   - Track user analytics (if implemented)

5. **Scale**
   - Add CI/CD pipeline
   - Implement automated testing
   - Optimize database queries
   - Consider caching strategy

---

**Ready to deploy? Let's do this! 🚀**

**Remember:** First deployment is the hardest. Once you've done it once, it gets much easier!

---

**Deployment Support:**
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com

**Good luck! You've got this! 💪**
