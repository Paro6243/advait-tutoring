-- Create Students Table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  location VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Tutors Table
CREATE TABLE tutors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  location VARCHAR(255),
  subjects TEXT,
  classes TEXT,
  available_timing VARCHAR(255),
  experience_level VARCHAR(50),
  hourly_rate DECIMAL(10, 2),
  comments TEXT,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Student Requests Table
CREATE TABLE student_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_level VARCHAR(50) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  medium VARCHAR(50),
  board VARCHAR(50),
  gender_preference VARCHAR(50),
  preferred_timing VARCHAR(255),
  budget DECIMAL(10, 2),
  comments TEXT,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Tutor Applications Table
CREATE TABLE tutor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES student_requests(id) ON DELETE CASCADE,
  tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Tutor Assignments Table
CREATE TABLE tutor_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES student_requests(id) ON DELETE CASCADE,
  tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  assigned_by UUID,
  status VARCHAR(50) DEFAULT 'assigned',
  demo_date TIMESTAMP,
  demo_status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES tutor_assignments(id) ON DELETE CASCADE,
  payment_type VARCHAR(50),
  amount DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  payment_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Admin Users Table (Optional - for multiple admins later)
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for better performance
CREATE INDEX idx_student_requests_student_id ON student_requests(student_id);
CREATE INDEX idx_student_requests_status ON student_requests(status);
CREATE INDEX idx_tutor_applications_request_id ON tutor_applications(request_id);
CREATE INDEX idx_tutor_applications_tutor_id ON tutor_applications(tutor_id);
CREATE INDEX idx_tutor_assignments_request_id ON tutor_assignments(request_id);
CREATE INDEX idx_tutor_assignments_tutor_id ON tutor_assignments(tutor_id);
CREATE INDEX idx_payments_assignment_id ON payments(assignment_id);
