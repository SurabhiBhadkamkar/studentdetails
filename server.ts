import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  department?: string;
  registeredAt: string;
  status: 'Active' | 'Pending' | 'Confirmed';
}

// Initial seed data
let students: Student[] = [
  {
    id: 'STU-4821',
    name: 'Elena Rostova',
    email: 'elena.rostova@university.edu',
    course: 'Computer Science & AI',
    department: 'Engineering & Tech',
    registeredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'Confirmed'
  },
  {
    id: 'STU-7392',
    name: 'Marcus Vance',
    email: 'marcus.vance@university.edu',
    course: 'Full Stack Web Development',
    department: 'Software Engineering',
    registeredAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'Confirmed'
  },
  {
    id: 'STU-1054',
    name: 'Priya Sharma',
    email: 'priya.sharma@university.edu',
    course: 'Data Science & Analytics',
    department: 'Mathematics & Stats',
    registeredAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'Active'
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser
  app.use(express.json());

  // API Health Check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // GET /api/students - Fetch all registered students
  app.get('/api/students', (_req: Request, res: Response) => {
    res.json({
      success: true,
      count: students.length,
      data: students
    });
  });

  // POST /api/students - Register a new student
  app.post('/api/students', (req: Request, res: Response) => {
    const { name, email, course, department, status } = req.body;

    // Server-side validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Student Name is required and cannot be empty.'
      });
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Email address is required.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid email address format.'
      });
    }

    if (!course || typeof course !== 'string' || !course.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Course selection is required.'
      });
    }

    // Check for duplicate email registration
    const existingStudent = students.find(
      (s) => s.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (existingStudent) {
      return res.status(409).json({
        success: false,
        error: 'Conflict Error',
        message: `A student with email "${email.trim()}" is already registered (ID: ${existingStudent.id}).`
      });
    }

    // Create new student record
    const newStudent: Student = {
      id: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      course: course.trim(),
      department: department?.trim() || 'General Academics',
      registeredAt: new Date().toISOString(),
      status: status || 'Confirmed'
    };

    students.unshift(newStudent);

    // Simulated network latency for realistic feel
    setTimeout(() => {
      res.status(201).json({
        success: true,
        message: 'Student registered successfully!',
        data: newStudent,
        meta: {
          timestamp: new Date().toISOString(),
          httpStatus: 201
        }
      });
    }, 400);
  });

  // DELETE /api/students/:id - Remove a student record
  app.delete('/api/students/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLength = students.length;
    students = students.filter((s) => s.id !== id);

    if (students.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: `Student with ID ${id} not found.`
      });
    }

    res.json({
      success: true,
      message: `Student record (${id}) deleted successfully.`
    });
  });

  // POST /api/students/reset - Reset to default seed
  app.post('/api/students/reset', (_req: Request, res: Response) => {
    students = [
      {
        id: 'STU-4821',
        name: 'Elena Rostova',
        email: 'elena.rostova@university.edu',
        course: 'Computer Science & AI',
        department: 'Engineering & Tech',
        registeredAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'Confirmed'
      },
      {
        id: 'STU-7392',
        name: 'Marcus Vance',
        email: 'marcus.vance@university.edu',
        course: 'Full Stack Web Development',
        department: 'Software Engineering',
        registeredAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'Confirmed'
      },
      {
        id: 'STU-1054',
        name: 'Priya Sharma',
        email: 'priya.sharma@university.edu',
        course: 'Data Science & Analytics',
        department: 'Mathematics & Stats',
        registeredAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        status: 'Active'
      }
    ];

    res.json({
      success: true,
      message: 'Student registry reset to default sample data.',
      data: students
    });
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
