# 🚀 Render Deployment Guide for Backlogger

Complete step-by-step guide for deploying Backlogger to Render with separate deployments for frontend and backend.

## 📋 Prerequisites

- [ ] GitHub account with Backlogger repository
- [ ] MongoDB Atlas account (free tier available)
- [ ] Render account (free tier available)

## 🗄️ Step 1: MongoDB Atlas Setup

### 1.1 Create MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click **"Build a Database"**
4. Select **"M0 Free"** tier
5. Choose **"AWS"** as provider
6. Select region closest to **Oregon** (Render's default region)
7. Click **"Create Cluster"**

### 1.2 Configure Database Access

1. Go to **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `backlogger-admin` (or your choice)
5. **Generate a secure password** and **save it somewhere safe!**
6. Database User Privileges: **"Atlas admin"**
7. Click **"Add User"**

### 1.3 Configure Network Access

1. Go to **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - *This is safe because MongoDB requires authentication*
4. Click **"Confirm"**

### 1.4 Get Connection String

1. Go to **"Database"** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy the connection string, it looks like:
   ```
   mongodb+srv://backlogger-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name before the `?`:
   ```
   mongodb+srv://backlogger-admin:YourPassword@cluster0.xxxxx.mongodb.net/backlogger?retryWrites=true&w=majority
   ```
7. **Save this connection string** - you'll need it for Render!

## 🔧 Step 2: Backend Deployment (Server)

### 2.1 Create Backend Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure service:

**Basic Settings:**
- **Name:** `backlogger-server`
- **Region:** Oregon (US West)
- **Branch:** `main`
- **Root Directory:** `server` ⚠️ **IMPORTANT**
- **Runtime:** Node
- **Build Command:**
  ```bash
  npm install && npm run build
  ```
- **Start Command:**
  ```bash
  npm start
  ```

### 2.2 Configure Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables one by one:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Required |
| `PORT` | `5000` | Render will override with its own port |
| `MONGO_URI` | `mongodb+srv://...` | Your MongoDB connection string from Step 1.4 |
| `JWT_SECRET` | Generate strong secret | See below for generation |
| `CLIENT_URL` | Leave empty for now | Will add after frontend deployment |

**Generate JWT Secret:**
```bash
# Run this in terminal:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy the output and use it as `JWT_SECRET`

### 2.3 Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment (~5 minutes)
3. Watch the logs for any errors
4. Once deployed, you'll see **"Live ✓"**
5. **Copy your backend URL:** `https://backlogger-server.onrender.com`

### 2.4 Test Backend

Open in browser:
```
https://backlogger-server.onrender.com/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-10-31T...",
  "uptime": 123.456
}
```

## 🎨 Step 3: Frontend Deployment (Client)

### 3.1 Update Environment Variable Locally

Before deploying, update the client's API URL:

1. Create `client/.env.production` file:
```bash
REACT_APP_API_URL=https://backlogger-server.onrender.com
```

2. Commit and push to GitHub:
```bash
git add client/.env.production
git commit -m "Add production API URL"
git push origin main
```

### 3.2 Create Frontend Static Site

1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Select your GitHub repository
3. Configure service:

**Basic Settings:**
- **Name:** `backlogger-client`
- **Branch:** `main`
- **Root Directory:** `client` ⚠️ **IMPORTANT**
- **Build Command:**
  ```bash
  npm install && npm run build
  ```
- **Publish Directory:**
  ```bash
  build
  ```

### 3.3 Configure Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://backlogger-server.onrender.com` |

Replace with your actual backend URL from Step 2.3

### 3.4 Configure Redirects/Rewrites

In **"Advanced"** section, add **"Rewrite Rules"**:

Add this rule for React Router:
- **Source:** `/*`
- **Destination:** `/index.html`
- **Action:** Rewrite

This ensures all routes work with React Router.

### 3.5 Deploy Frontend

1. Click **"Create Static Site"**
2. Wait for deployment (~3 minutes)
3. Watch the build logs
4. Once deployed, you'll see **"Live ✓"**
5. **Copy your frontend URL:** `https://backlogger-client.onrender.com`

## 🔗 Step 4: Connect Frontend and Backend

### 4.1 Update Backend CORS

1. Go to your **backend service** in Render
2. Click **"Environment"** tab
3. Update `CLIENT_URL`:
   ```
   https://backlogger-client.onrender.com
   ```
4. Click **"Save Changes"**
5. Render will automatically redeploy

### 4.2 Update Backend CORS Code

The CORS configuration should already be in place in `server/src/app.ts`:

```typescript
const allowedOrigins = [
  'http://localhost:3000',
  process.env.CLIENT_URL
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

If not present, add it and push to GitHub.

## ✅ Step 5: Test Full Application

### 5.1 Open Frontend

Go to: `https://backlogger-client.onrender.com`

### 5.2 Test Complete User Flow

1. **Register Account**
   - Click "Sign Up"
   - Enter email, password, name, surname
   - Submit

2. **Login**
   - Use credentials from registration
   - Verify you're redirected to projects page

3. **Create Project**
   - Click "Create Project"
   - Enter project name
   - Verify project appears

4. **Create Backlog**
   - Inside project, click "Create Backlog"
   - Enter backlog name
   - Verify backlog appears

5. **Create Sprint**
   - Inside backlog, click "Create Sprint"
   - Enter sprint name, goal, dates
   - Verify sprint appears

6. **Create Task**
   - Inside sprint, click "Create Task"
   - Fill all fields
   - Verify task appears

7. **View Analytics**
   - Navigate to Analytics page
   - Verify charts load with data
   - Test date filters

8. **Test Mobile**
   - Open on phone
   - Verify responsive design works

### 5.3 Check Browser Console

Press `F12` → Console tab
- Should see NO errors
- Should see successful API calls

## 🎯 Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain to Backend

1. Go to backend service → **"Settings"**
2. Scroll to **"Custom Domain"**
3. Click **"Add Custom Domain"**
4. Enter: `api.yourdomain.com`
5. Add CNAME record in your DNS:
   ```
   api.yourdomain.com → backlogger-server.onrender.com
   ```

### 6.2 Add Custom Domain to Frontend

1. Go to frontend service → **"Settings"**
2. Scroll to **"Custom Domain"**
3. Click **"Add Custom Domain"**
4. Enter: `yourdomain.com` or `www.yourdomain.com`
5. Add CNAME record in your DNS:
   ```
   yourdomain.com → backlogger-client.onrender.com
   ```

### 6.3 Update Environment Variables

After adding custom domains:

**Backend:**
- Update `CLIENT_URL` to `https://yourdomain.com`

**Frontend:**
- Update `REACT_APP_API_URL` to `https://api.yourdomain.com`

## 🔍 Troubleshooting

### Issue: Build Fails

**Backend Build Error:**
```bash
# Check logs in Render dashboard
# Common issues:
- Missing dependencies in package.json
- TypeScript compilation errors
- Wrong Node version
```

**Solution:**
1. Check build command is correct
2. Verify `npm run build` works locally
3. Ensure all dependencies in package.json

**Frontend Build Error:**
```bash
# Common issues:
- Environment variable not set
- Import errors
- Missing dependencies
```

**Solution:**
1. Check `REACT_APP_API_URL` is set
2. Run `npm run build` locally
3. Fix any TypeScript errors

### Issue: CORS Errors

**Error in browser console:**
```
Access to XMLHttpRequest at 'https://...' has been blocked by CORS policy
```

**Solution:**
1. Verify `CLIENT_URL` is set correctly in backend
2. Check frontend URL matches exactly (with https://)
3. Wait for backend redeploy after changing env vars
4. Clear browser cache and hard reload (Cmd+Shift+R)

### Issue: 502 Bad Gateway

**Backend not responding:**

**Solution:**
1. Check backend logs in Render
2. Verify `MONGO_URI` is correct
3. Check MongoDB Atlas IP whitelist includes 0.0.0.0/0
4. Restart backend service

### Issue: Database Connection Failed

**Error in backend logs:**
```
MongooseServerSelectionError: Could not connect to any servers
```

**Solution:**
1. Verify MongoDB Atlas cluster is running
2. Check connection string has correct password
3. Ensure IP whitelist includes 0.0.0.0/0
4. Test connection string locally first

### Issue: JWT Errors

**Error:**
```
JsonWebTokenError: invalid signature
```

**Solution:**
1. Ensure `JWT_SECRET` is set on backend
2. Must be same secret consistently
3. If changed, all users need to re-login

### Issue: Slow Cold Starts

**Render free tier:**
- Services spin down after 15 min inactivity
- First request takes ~30 seconds to wake up

**Solution:**
1. Upgrade to paid plan ($7/month) for always-on
2. Or use a monitoring service to ping every 14 minutes
3. Or accept cold starts for free tier

## 📊 Monitoring

### Render Dashboard

**Check regularly:**
- Deployment status
- Build logs
- Runtime logs
- Metrics (CPU, Memory)

### Set Up Monitoring

**UptimeRobot (Free):**
1. Go to [UptimeRobot](https://uptimerobot.com)
2. Add monitor for: `https://backlogger-server.onrender.com/health`
3. Check interval: 5 minutes
4. Get email alerts if down

**Error Tracking (Optional):**
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for usage

## 🎉 Success Checklist

Deployment is successful when:

- ✅ Backend health check returns 200 OK
- ✅ Frontend loads without errors
- ✅ Can register new account
- ✅ Can login successfully
- ✅ Can create project/backlog/sprint/task
- ✅ Analytics display data
- ✅ No CORS errors
- ✅ No console errors
- ✅ Works on mobile
- ✅ HTTPS active on both services

## 📝 Post-Deployment Tasks

### Update README

Add live demo links:

```markdown
## 🚀 Live Demo

**Frontend:** [https://backlogger-client.onrender.com](https://backlogger-client.onrender.com)
**API:** [https://backlogger-server.onrender.com](https://backlogger-server.onrender.com)

### Demo Account
- **Email:** demo@backlogger.com
- **Password:** Demo123!

*Feel free to explore! Note: Free tier may have cold start delays.*
```

### Share Your Work

1. Update LinkedIn with live link
2. Add to portfolio website
3. Share on Twitter/X
4. Post on dev.to
5. Add to resume

## 💰 Cost Summary

**Free Tier:**
- MongoDB Atlas: Free (M0)
- Render Backend: Free (750 hours/month, spins down after 15min)
- Render Frontend: Free (100GB bandwidth/month)
- **Total: $0/month** ✨

**Paid Tier (Recommended for Production):**
- MongoDB Atlas: $0 (still free)
- Render Backend: $7/month (always-on, no cold starts)
- Render Frontend: $0 (still free)
- **Total: $7/month**

## 🔄 Continuous Deployment

**Auto-deploy is enabled by default!**

Every time you push to `main` branch:
1. Render detects the commit
2. Automatically rebuilds
3. Deploys new version
4. Takes ~5 minutes

**Manual Deploy:**
- Go to service in Render
- Click "Manual Deploy" → "Clear build cache & deploy"

## 📞 Support

**Render Support:**
- [Render Documentation](https://render.com/docs)
- [Community Forum](https://community.render.com)
- [Status Page](https://status.render.com)

**MongoDB Support:**
- [Atlas Documentation](https://docs.atlas.mongodb.com)
- [Community Forum](https://www.mongodb.com/community/forums)

---

## 🎯 Quick Reference

**Backend URL Structure:**
```
https://backlogger-server.onrender.com/health
https://backlogger-server.onrender.com/user-projects
https://backlogger-server.onrender.com/...
```

**Frontend URL:**
```
https://backlogger-client.onrender.com
```

**Environment Variables:**

Backend:
- `NODE_ENV=production`
- `PORT=5000`
- `MONGO_URI=mongodb+srv://...`
- `JWT_SECRET=<your-secret>`
- `CLIENT_URL=https://backlogger-client.onrender.com`

Frontend:
- `REACT_APP_API_URL=https://backlogger-server.onrender.com`

---

**🎉 Congratulations! Your app is live! 🚀**

**Need help?** Check the troubleshooting section or Render's excellent documentation.

**Happy deploying! 💪**
