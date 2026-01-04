# PeerPath - Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

Your project has been configured for Vercel deployment with the following optimizations:

### Configuration Files Created/Updated:
- ✓ `vercel.json` - Vercel-specific configuration
- ✓ `vite.config.ts` - Optimized build settings with code splitting
- ✓ `package.json` - Updated with Vercel build script and Node.js engine requirement
- ✓ `.env.example` - Template for environment variables
- ✓ `services/geminiService.ts` - Enhanced error handling and API key management

### Build Optimizations:
- ✓ Code splitting for React and Gemini vendors
- ✓ Terser minification enabled
- ✓ Source maps disabled for production
- ✓ SPA routing configured with rewrites
- ✓ Node.js 18+ requirement specified

---

## 🚀 Step-by-Step Deployment to Vercel

### Step 1: Prepare Your Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Configure for Vercel deployment"

# Add your GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/peerpath.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Paste your GitHub repository URL: `https://github.com/YOUR_USERNAME/peerpath.git`
5. Click **"Import"**

### Step 3: Configure Environment Variables

1. After importing, you'll see the **"Configure Project"** screen
2. Under **"Environment Variables"**, add:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: `AIzaSyA8PNvmBeIdUy26XtpgMWbsFLj2B5jC1EA`
   - Click **"Add"**

3. Verify the settings:
   - **Framework Preset**: Vite (should auto-detect)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-3 minutes)
3. Once successful, you'll see your live URL: `https://peerpath-xxxxx.vercel.app`

---

## 🔍 Verification After Deployment

Test these features to ensure everything works:

- [ ] Landing page loads without errors
- [ ] Can navigate to Dashboard
- [ ] Can access Ask Question page
- [ ] Gemini API integration works (test by asking a question)
- [ ] Question detail page displays correctly
- [ ] Profile page is accessible
- [ ] All styling and animations work
- [ ] No console errors in browser DevTools

---

## 📊 Deployment URL

Your site will be available at:
```
https://peerpath-[random-id].vercel.app
```

### Custom Domain (Optional)
1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

---

## 🔄 Continuous Deployment

After initial deployment:
- Every push to `main` branch will automatically trigger a new deployment
- Vercel will run the build command and deploy to production
- Previous deployments are preserved for rollback if needed

### To Deploy Changes:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

---

## 🆘 Troubleshooting

### Build Fails
**Error**: `GEMINI_API_KEY is not configured`
- **Solution**: Verify the environment variable is set in Vercel dashboard
- Go to **Settings** → **Environment Variables**
- Ensure `GEMINI_API_KEY` is added and saved

**Error**: `Module not found`
- **Solution**: Run `npm install` locally and commit `package-lock.json`
- Ensure all imports use correct paths

### API Calls Fail
**Error**: `GoogleGenAI is not defined`
- **Solution**: Check that `@google/genai` is in `package.json` dependencies
- Clear Vercel cache: **Settings** → **Git** → **Clear Build Cache**

### Routes Not Working
**Error**: 404 on page refresh
- **Solution**: The `vercel.json` includes SPA rewrites
- All routes redirect to `/index.html` for React Router handling
- This is already configured and should work automatically

### Chunk Size Warning
- The build may show warnings about chunk sizes
- This is acceptable for a frontend-only application
- Performance is still good with current configuration

---

## 📈 Performance Optimization

Current optimizations in place:
- ✓ Code splitting (React, Gemini vendors separated)
- ✓ Minification with Terser
- ✓ No source maps in production
- ✓ Vite's native tree-shaking

### Future Improvements:
- Consider lazy loading page components
- Implement image optimization
- Add service worker for offline support
- Monitor bundle size with `npm run build`

---

## 🔐 Security Notes

### API Key Exposure
- The `GEMINI_API_KEY` is exposed in the frontend (necessary for client-side AI calls)
- This is acceptable for Gemini API (designed for client-side use)
- Monitor API usage in [Google Cloud Console](https://console.cloud.google.com/)
- Consider implementing rate limiting in future versions

### Environment Variables
- Never commit `.env.local` to git (already in `.gitignore`)
- Use `.env.example` as a template for team members
- Vercel environment variables are encrypted and secure

---

## 📝 Important Files

- `vercel.json` - Vercel configuration
- `vite.config.ts` - Build configuration
- `package.json` - Dependencies and scripts
- `.env.example` - Environment variable template
- `services/geminiService.ts` - API integration with error handling

---

## ✨ You're Ready!

Your PeerPath website is now fully configured for Vercel deployment. Follow the steps above to deploy your application.

**Status**: ✅ Ready for Vercel Deployment

---

## 📞 Support

If you encounter issues:
1. Check Vercel build logs: **Deployments** → **Failed** → **View Logs**
2. Verify environment variables are set correctly
3. Ensure all dependencies are in `package.json`
4. Test locally with `npm run build && npm run preview`
