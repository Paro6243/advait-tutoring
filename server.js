const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// STUDENT ROUTES
// Student Registration
app.post('/api/auth/student-register', async (req, res) => {
  try {
    const { name, phone, email, location, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('students')
      .insert([
        {
          name,
          phone,
          email,
          location,
          password_hash: hashedPassword,
        },
      ])
      .select();

    if (error) throw error;

    const token = jwt.sign(
      { id: data[0].id, type: 'student', email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: data[0] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Student Login
app.post('/api/auth/student-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, data.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: data.id, type: 'student', email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: data.id, name: data.name, email: data.email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Student Profile
app.get('/api/student/profile', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Student Submit Request
app.post('/api/student/request', authMiddleware, async (req, res) => {
  try {
    const {
      class_level,
      subject,
      medium,
      board,
      gender_preference,
      preferred_timing,
      budget,
      comments,
    } = req.body;

    const { data, error } = await supabase
      .from('student_requests')
      .insert([
        {
          student_id: req.user.id,
          class_level,
          subject,
          medium,
          board,
          gender_preference,
          preferred_timing,
          budget,
          comments,
          status: 'new',
        },
      ])
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Student's Requests
app.get('/api/student/requests', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('student_requests')
      .select('*')
      .eq('student_id', req.user.id);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// TUTOR ROUTES
// Tutor Registration
app.post('/api/auth/tutor-register', async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      location,
      subjects,
      classes,
      available_timing,
      experience_level,
      hourly_rate,
      comments,
      password,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('tutors')
      .insert([
        {
          name,
          phone,
          email,
          location,
          subjects: JSON.stringify(subjects),
          classes: JSON.stringify(classes),
          available_timing,
          experience_level,
          hourly_rate,
          comments,
          password_hash: hashedPassword,
        },
      ])
      .select();

    if (error) throw error;

    const token = jwt.sign(
      { id: data[0].id, type: 'tutor', email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: data[0] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Tutor Login
app.post('/api/auth/tutor-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase
      .from('tutors')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, data.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: data.id, type: 'tutor', email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: data.id, name: data.name, email: data.email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Tutor Profile
app.get('/api/tutor/profile', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tutors')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Available Student Requests (for tutors to see)
app.get('/api/tutor/available-requests', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('student_requests')
      .select('*')
      .eq('status', 'new');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Tutor Apply for Request
app.post('/api/tutor/apply-request', authMiddleware, async (req, res) => {
  try {
    const { request_id } = req.body;

    const { data, error } = await supabase
      .from('tutor_applications')
      .insert([
        {
          request_id,
          tutor_id: req.user.id,
          status: 'pending',
        },
      ])
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Tutor Applications
app.get('/api/tutor/applications', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tutor_applications')
      .select('*, student_requests(*)')
      .eq('tutor_id', req.user.id);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ADMIN ROUTES
// Admin Login (simplified for now)
app.post('/api/auth/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hardcoded admin for now - change to database lookup
    if (
      email === 'admin@advait.com' &&
      password === 'admin123'
    ) {
      const token = jwt.sign(
        { id: 'admin', type: 'admin', email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        token,
        user: { id: 'admin', name: 'Admin', email },
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin Get All Student Requests
app.get('/api/admin/requests', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('student_requests')
      .select('*, students(*), tutor_assignments(*, tutors(*))');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin Assign Tutor to Request
app.post('/api/admin/assign-tutor', authMiddleware, async (req, res) => {
  try {
    const { request_id, tutor_id } = req.body;

    const { data, error } = await supabase
      .from('tutor_assignments')
      .insert([
        {
          request_id,
          tutor_id,
          assigned_by: req.user.id,
          status: 'assigned',
        },
      ])
      .select();

    if (error) throw error;

    // Update request status
    await supabase
      .from('student_requests')
      .update({ status: 'assigned' })
      .eq('id', request_id);

    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin Update Payment Status
app.post('/api/admin/payment', authMiddleware, async (req, res) => {
  try {
    const {
      assignment_id,
      payment_type,
      amount,
      status,
    } = req.body;

    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          assignment_id,
          payment_type,
          amount,
          status,
        },
      ])
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin Get All Tutors
app.get('/api/admin/tutors', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tutors')
      .select('id, name, email, phone, location, experience_level');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Admin Get Dashboard Stats
app.get('/api/admin/stats', authMiddleware, async (req, res) => {
  try {
    const { data: totalRequests, error: err1 } = await supabase
      .from('student_requests')
      .select('id', { count: 'exact' });

    const { data: assignedRequests, error: err2 } = await supabase
      .from('student_requests')
      .select('id', { count: 'exact' })
      .eq('status', 'assigned');

    const { data: payments, error: err3 } = await supabase
      .from('payments')
      .select('amount');

    if (err1 || err2 || err3) throw new Error('Stats error');

    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

    res.json({
      total_requests: totalRequests?.length || 0,
      assigned_requests: assignedRequests?.length || 0,
      total_revenue: totalRevenue,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
