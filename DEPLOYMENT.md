# 🚀 Deployment Guide - ArjunRajput.ai Portfolio

## Quick Deployment Options

### 1. Vercel (Recommended - Easiest)

Vercel is the creators of Next.js and offers the best deployment experience.

#### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: ArjunRajput.ai portfolio"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"
   - Your site will be live at: `your-project.vercel.app`

3. **Custom Domain (Optional)**
   - In Vercel dashboard, go to "Settings" → "Domains"
   - Add your custom domain (e.g., arjunrajput.ai)
   - Follow DNS configuration instructions

**Environment Variables** (if needed):
- Add any environment variables in Vercel dashboard under "Settings" → "Environment Variables"

---

### 2. Netlify

Another excellent option for Next.js deployment.

#### Steps:

1. **Build Configuration**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Deploy**
   - Visit [netlify.com](https://netlify.com)
   - Sign up/Login
   - Drag and drop your project folder OR connect GitHub
   - Configure build settings
   - Deploy

---

### 3. GitHub Pages (Static Export)

For a static version without server-side features.

#### Steps:

1. **Update `next.config.js`**
   ```javascript
   module.exports = {
     output: 'export',
     images: {
       unoptimized: true,
     },
   }
   ```

2. **Build Static Site**
   ```bash
   npm run build
   ```

3. **Deploy to GitHub Pages**
   - Create a GitHub repository
   - Push the `out` folder to `gh-pages` branch
   - Enable GitHub Pages in repository settings

---

### 4. Self-Hosting (VPS/Cloud Server)

For full control and custom server setup.

#### Requirements:
- Node.js 18+ installed on server
- PM2 or similar process manager

#### Steps:

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Upload to Server**
   ```bash
   scp -r .next package.json package-lock.json user@your-server:/path/to/app
   ```

3. **Install Dependencies on Server**
   ```bash
   ssh user@your-server
   cd /path/to/app
   npm install --production
   ```

4. **Run with PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "arjun-portfolio" -- start
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx (Optional)**
   ```nginx
   server {
       listen 80;
       server_name arjunrajput.ai;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## 🔧 Pre-Deployment Checklist

- [ ] Update social media links in `components/Contact.tsx` and `components/Achievements.tsx`
- [ ] Add actual project links in `components/Projects.tsx`
- [ ] Verify resume PDF is in public folder
- [ ] Verify profile photo is in public folder
- [ ] Test dark mode toggle
- [ ] Test all navigation links
- [ ] Test contact form (add backend if needed)
- [ ] Check responsive design on multiple devices
- [ ] Run `npm run build` to check for errors
- [ ] Test SEO meta tags
- [ ] Add Google Analytics (optional)

---

## 🌐 Custom Domain Setup

### For Vercel:

1. **Purchase Domain** (from Namecheap, GoDaddy, etc.)
2. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your domain: `arjunrajput.ai`
3. **Configure DNS** (in your domain registrar):
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

---

## 📊 Performance Optimization

### Implemented Features:
✅ Image optimization with Next.js Image component
✅ Code splitting and lazy loading
✅ Tailwind CSS purging unused styles
✅ Framer Motion animations optimized
✅ SEO meta tags configured

### Additional Optimizations:
- Enable Vercel Analytics
- Add CDN for static assets
- Implement service worker for offline support
- Add loading skeletons

---

## 🔐 Security Best Practices

- [ ] Add Content Security Policy headers
- [ ] Enable HTTPS (automatic on Vercel/Netlify)
- [ ] Sanitize contact form inputs (add backend validation)
- [ ] Rate limiting for form submissions
- [ ] Add reCAPTCHA to contact form

---

## 📈 Analytics Setup (Optional)

### Google Analytics:

1. Create GA4 property
2. Add tracking code to `app/layout.tsx`:
   ```typescript
   <Script
     src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
     strategy="afterInteractive"
   />
   ```

### Vercel Analytics:

1. Enable in Vercel dashboard
2. Install package: `npm install @vercel/analytics`
3. Add to `app/layout.tsx`:
   ```typescript
   import { Analytics } from '@vercel/analytics/react';
   // ... in return statement
   <Analytics />
   ```

---

## 🐛 Troubleshooting

### Build Errors:
- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node -v` (should be 18+)

### Image Issues:
- Ensure images are in `public` folder
- Use correct paths: `/image.jpg` not `./image.jpg`
- Check Next.js Image configuration

### Deployment Issues:
- Check build logs in Vercel/Netlify dashboard
- Verify environment variables
- Check for console errors in browser

---

## 📞 Support & Updates

For questions or issues:
- Check Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)
- Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- GitHub Issues: Create an issue in your repository

---

## 🎉 Post-Deployment

After deployment:
1. Test all features on live site
2. Share your portfolio link on social media
3. Add portfolio link to resume
4. Update LinkedIn with portfolio URL
5. Submit to Google Search Console for SEO

---

**Your portfolio is ready to showcase your amazing work! 🚀**

Built with ❤️ using Next.js, TypeScript, Tailwind CSS, and Framer Motion
