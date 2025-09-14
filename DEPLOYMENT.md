# 🚀 VERCEL DEPLOYMENT GUIDE

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- Your StudyBuddy project pushed to GitHub

## Step-by-Step Deployment

### 1. Prepare Your Project
```bash
# Make sure your project builds successfully
npm run build

# Test the production build locally
npm run preview
```

### 2. Push to GitHub
```bash
# Add all files to git
git add .

# Commit your changes
git commit -m "feat: complete StudyBuddy app for NAVER AI Hackathon"

# Push to your repository
git push origin main
```

### 3. Deploy on Vercel

#### Option A: Via Vercel Website (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" and connect with your GitHub account
3. Click "New Project"
4. Import your GitHub repository: `web-track-naver-vietnam-ai-hackathon-nolan0801`
5. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Click "Deploy"

#### Option B: Via Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to your project directory
cd web-track-naver-vietnam-ai-hackathon-nolan0801

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? [Your account]
# - Link to existing project? No
# - Project name? studybuddy-ai-hackathon
# - Directory? ./
# - Override settings? No
```

### 4. Verify Deployment
- Your app will be deployed to: `https://your-project-name.vercel.app`
- Test all features:
  - Focus Timer functionality
  - Session creation and management
  - Analytics dashboard
  - Responsive design on mobile
  - localStorage persistence

### 5. Custom Domain (Optional)
1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" → "Domains"
4. Add your custom domain if you have one

### 6. Environment Variables (If needed)
1. In Vercel dashboard → Settings → Environment Variables
2. Add any environment variables your app needs
3. Redeploy if variables are added

## Common Issues & Solutions

### Build Errors
```bash
# If build fails, check for:
1. Unused imports/variables
2. Missing dependencies
3. Type errors (if using TypeScript)

# Fix and redeploy:
git add .
git commit -m "fix: resolve build issues"
git push origin main
```

### Performance Optimization
```bash
# For better performance, ensure:
1. Images are optimized
2. Large dependencies are code-split
3. Unused code is removed
```

## Automatic Updates
- Every push to your main branch will trigger a new deployment
- Vercel will automatically build and deploy your changes
- You'll get a unique URL for each deployment

## Final Checklist for Deployment
- [ ] App builds successfully (`npm run build`)
- [ ] All features work in production build
- [ ] Mobile responsiveness tested
- [ ] localStorage functionality verified
- [ ] Performance is acceptable
- [ ] All dependencies are in package.json
- [ ] README.md is updated with deployment URL

## Update README with Deployment URL
After successful deployment, update your README.md:

```markdown
## 🔗 Deployed Web URL
✅ **Live Demo:** [StudyBuddy on Vercel](https://your-actual-vercel-url.vercel.app)
```