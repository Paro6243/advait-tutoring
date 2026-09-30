# Advait Home Tutoring & Consultancy - Deployment Guide

## Overview
This is a complete two-sided marketplace platform for tutors and students with an admin dashboard for managing leads, assignments, and payments.

## Project Structure
```
advait-tutoring/
├── server.js                 # Node.js backend server
├── package.json             # Backend dependencies
├── database_schema.sql      # Supabase database schema
├── frontend/                # React frontend
│   ├── src/
│   │   ├── pages/          # All pages (Student, Tutor, Admin)
│   │   ├── styles/         # CSS styling
│   │   ├── App.jsx         # Main app component
│   │   ├── index.jsx       # React entry point
│   ├── public/
│   ├── package.json        # Frontend dependencies
```

## Features Implemented

### For Students
✅ Registration & Login
✅ View pricing structure
✅ Submit tutor requests (with medium, board, class, subject, gender preference, timing)
✅ Track request status
✅ Dashboard with profile and requests

### For Tutors
✅ Registration & Login
✅ Browse available student requests
✅ Apply for student requests
✅ Track applications and status
✅ Dashboard with profile

### For Admin (You & Partner)
✅ Complete dashboard to manage everything
✅ View all student requests
✅ View all tutors
✅ Assign tutors to requests
✅ Filter requests by status
✅ Track payment status
✅ View revenue stats

## Step-by-Step Deployment

### Step 1: Create Supabase Account (FREE)

1. Go to https://supabase.com
2. Sign up with your email
3. Create a new project
   - Project name: `advait-tutoring`
   - Database password: Create a strong password
   - Region: Select closest to your location
4. Wait for project to be created (2-3 minutes)
5. Go to your project settings
6. Under "API", copy:
   - `Project URL` → This is `SUPABASE_URL`
   - `anon public` key → This is `SUPABASE_KEY`

### Step 2: Set Up Database

1. In Supabase dashboard, go to SQL Editor
2. Create a new query
3. Copy the entire contents of `database_schema.sql` file
4. Paste into the SQL editor
5. Click "Run"
6. Wait for all tables to be created

### Step 3: Deploy Backend

**Option A: Deploy to Railway (Recommended for beginners)**

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub"
4. Select this repository
5. Add environment variables:
   - `SUPABASE_URL` = Your Supabase URL
   - `SUPABASE_KEY` = Your Supabase anon key
   - `JWT_SECRET` = Create any random string (e.g., "your-secret-key-123")
   - `NODE_ENV` = production
6. Railway will automatically deploy your backend
7. Copy the deployed backend URL (should look like: `https://your-project.railway.app`)

**Option B: Deploy to Render (Also free)**

1. Go to https://render.com
2. Sign up
3. Create new "Web Service"
4. Connect your GitHub repository
5. Set Environment Variables (same as above)
6. Deploy

### Step 4: Deploy Frontend

1. Go to https://netlify.com
2. Sign up with GitHub
3. Click "New site from Git"
4. Connect your GitHub repository
5. Build command: `npm run build`
6. Publish directory: `frontend/build`
7. Go to Site settings → Environment variables
8. Add: `REACT_APP_API_URL` = Your backend URL from Step 3
9. Netlify will automatically build and deploy your frontend
10. Copy your Netlify URL (should look like: `https://your-site.netlify.app`)

### Step 5: Test the Platform

1. Visit your Netlify URL
2. You should see the home page with pricing
3. Test Student Registration:
   - Click "Student Register"
   - Fill form and register
   - You'll be logged in automatically
4. Test Tutor Registration:
   - Go back to home
   - Click "Tutor Register"
   - Fill form and register
5. Test Admin Login:
   - Go back to home
   - Click "Admin Login" (look for admin login link)
   - Email: `admin@advait.com`
   - Password: `admin123`

## Important Credentials

### Admin Login (For Testing)
- Email: `admin@advait.com`
- Password: `admin123`

⚠️ **Change these credentials later by updating the backend code!**

## How It Works

### Student Flow
1. Student registers → Gets account
2. Student submits request (subject, class, medium, board, etc.)
3. Admin sees request in dashboard
4. Admin assigns a tutor
5. Student and tutor connect
6. After demo, student pays ₹200 service charge
7. Tutor pays 50% of first income to you (through UPI, you update manually)

### Tutor Flow
1. Tutor registers → Gets account
2. Tutor sees available student requests
3. Tutor applies for requests
4. Admin reviews and approves/rejects
5. If approved, tutor starts tutoring
6. Tutor pays 50% of first income to you

### Admin Workflow
1. Login to admin dashboard
2. View all student requests
3. Click "Assign" on any request
4. Select a tutor from the list
5. Request status changes to "assigned"
6. Track payments manually (you'll need to add payment tracking UI enhancement)

## Customization Checklist

After deployment, you should:

- [ ] Change admin login credentials in `server.js`
- [ ] Update admin commission/pricing if needed
- [ ] Add WhatsApp contact button (for custom quotes)
- [ ] Add your own branding/logo
- [ ] Test all features thoroughly
- [ ] Set up email notifications (future enhancement)

## Database Backup

To backup your data from Supabase:
1. Go to Supabase dashboard
2. Settings → Backups
3. Download backup regularly

## Support & Maintenance

### Common Issues

**Q: Backend not connecting?**
- Check SUPABASE_URL and SUPABASE_KEY are correct
- Check JWT_SECRET is set
- Verify CORS is enabled in backend

**Q: Frontend showing blank page?**
- Check browser console for errors
- Verify REACT_APP_API_URL is set correctly
- Clear browser cache

**Q: Can't login?**
- Verify database tables are created
- Check email/password are correct
- Check backend is running

## Pricing Configuration

Current pricing in `HomePage.jsx`:
- Update the `pricingData` object to match your rates
- Rates are displayed on home page automatically

## Payment Tracking Enhancement

Current system:
- You manually update payment status in admin dashboard
- Future enhancement: Add payment form where tutors pay directly

## Next Steps

1. Deploy the current version
2. Test thoroughly
3. Get feedback from your partner
4. Plan enhancements (email notifications, payment gateway, etc.)

## Important Notes

- All data is secure in Supabase (PostgreSQL database)
- Free tier covers 100+ users easily
- Scale to paid plan when you exceed limits
- No credit card required for free tier

---

**Good luck with your platform! 🚀**

For questions, refer to Supabase docs, Railway docs, or Netlify docs.
