# Admin Dashboard Backend API Documentation

## Overview
Complete backend implementation for the VDS Admin Dashboard with role-based access control, activity logging, and comprehensive management features.

## 🗄️ Database Models

### 1. ActivityLog
```typescript
interface IActivityLog {
  userId: string;           // Admin user who performed the action
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  entityType: 'PROJECT' | 'USER' | 'CONTENT' | 'AUTH' | 'JOB' | 'APPLICATION';
  entityId?: string;        // ID of the affected entity
  description: string;      // Human-readable description
  timestamp: Date;          // When the action occurred
  metadata?: Record<string, any>; // Additional context
}
```

### 2. WebsiteContent
```typescript
interface IWebsiteContent {
  page: 'HOME' | 'ABOUT' | 'TEAM' | 'CONTACT' | 'CAREERS';
  section: string;          // Content section identifier
  title?: string;           // Optional title
  content: string;          // Main content
  contentType: 'TEXT' | 'HTML' | 'MARKDOWN';
  isActive: boolean;        // Whether content is live
  lastModifiedBy: string;   // Admin user who last modified
  lastModifiedAt: Date;     // Last modification timestamp
}
```

### 3. JobPosting
```typescript
interface IJobPosting {
  title: string;
  department: string;
  location: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  experienceLevel: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD';
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  isActive: boolean;
  applicationDeadline?: Date;
  createdBy: string;        // Admin user who created
}
```

### 4. JobApplication
```typescript
interface IJobApplication {
  jobPostingId: string;     // Reference to job posting
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  resumeUrl: string;        // URL to uploaded resume
  coverLetter?: string;
  status: 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' | 'HIRED';
  appliedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;      // Admin user who reviewed
  notes?: string;           // Internal notes
}
```

## 🔌 API Endpoints

### Dashboard Statistics
- **GET** `/api/admin/dashboard/stats` - Get dashboard statistics
  - Returns: totalProjects, liveProjects, positions, applicantsTotal, newApplicants, shortlisted, recentActivity

### User Management (Super Admin Only)
- **GET** `/api/admin/users` - List all admin users
- **POST** `/api/admin/users` - Create new admin user
- **PUT** `/api/admin/users/:id` - Update admin user
- **DELETE** `/api/admin/users/:id` - Delete admin user

### Website Content Management
- **GET** `/api/admin/content` - Get all website content
- **GET** `/api/admin/content?page=HOME` - Get content by page
- **PUT** `/api/admin/content/:id` - Update content

### Activity Logs
- **GET** `/api/admin/activity` - Get recent activity logs
- **GET** `/api/admin/activity?userId=123` - Get user-specific activity
- **GET** `/api/admin/activity?limit=50&page=1` - Paginated activity logs

### Job Posting Management
- **GET** `/api/hiring/jobs` - List job postings
- **POST** `/api/hiring/jobs` - Create job posting (Admin/Super Admin)
- **PUT** `/api/hiring/jobs/:id` - Update job posting (Admin/Super Admin)
- **DELETE** `/api/hiring/jobs/:id` - Delete job posting (Admin/Super Admin)

### Job Application Management
- **GET** `/api/hiring/applications` - Get job applications
- **GET** `/api/hiring/applications?jobPostingId=123` - Get applications for specific job
- **PUT** `/api/hiring/applications/:id/status` - Update application status (Admin/Super Admin)

### Public Job Application
- **POST** `/api/hiring/applications` - Submit job application (Public)

## 🔐 Authentication & Authorization

### Authentication
- JWT-based authentication
- All admin routes require valid JWT token
- Token expires in 7 days (configurable)

### Role-Based Access Control
- **Super Admin**: Full access to all features
- **Admin**: Access to content management, job management, but not user management
- **HR**: Access to hiring portal only
- **Content Manager**: Access to content management only

### Protected Routes
```typescript
// All admin routes require authentication
router.use(protect);

// Super Admin only routes
router.get('/users', requireRole(['super_admin']), getAllUsers);
router.post('/users', requireRole(['super_admin']), createUser);

// Admin/Super Admin routes
router.post('/jobs', requireRole(['admin', 'super_admin']), createJobPosting);
```

## 📊 Activity Logging

### Automatic Logging
- **Login/Logout**: Tracked automatically
- **User Management**: All CRUD operations logged
- **Content Updates**: Tracked with metadata
- **Job Management**: All job posting changes logged
- **Application Status**: Status changes logged

### Log Structure
```json
{
  "userId": "admin_user_id",
  "action": "UPDATE",
  "entityType": "PROJECT",
  "entityId": "project_id",
  "description": "Updated project: Project Name",
  "timestamp": "2024-01-15T10:30:00Z",
  "metadata": {
    "changes": ["name", "status"],
    "oldStatus": "Design stage",
    "newStatus": "On-site"
  }
}
```

## 📧 Email Notifications

### Job Application Notifications
- **Confirmation Email**: Sent to applicant upon submission
- **Status Update Email**: Sent when application status changes
- **Professional HTML Templates**: Branded email templates

### Email Templates
- Application received confirmation
- Status update notifications (shortlisted, rejected, hired)
- Professional styling with VDS branding

## 🚀 Usage Examples

### Get Dashboard Statistics
```bash
GET /api/admin/dashboard/stats
Authorization: Bearer <jwt_token>

Response:
{
  "success": true,
  "data": {
    "totalProjects": 25,
    "liveProjects": 8,
    "positions": "8:5",
    "applicantsTotal": 45,
    "newApplicants": 12,
    "shortlisted": 8,
    "recentActivity": [...]
  }
}
```

### Create Job Posting
```bash
POST /api/hiring/jobs
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Senior Architect",
  "department": "Design",
  "location": "Mumbai",
  "employmentType": "FULL_TIME",
  "experienceLevel": "SENIOR",
  "description": "We are looking for a senior architect...",
  "requirements": ["5+ years experience", "AutoCAD proficiency"],
  "responsibilities": ["Lead design projects", "Mentor junior architects"],
  "benefits": ["Health insurance", "Flexible hours"],
  "salaryRange": {
    "min": 800000,
    "max": 1200000,
    "currency": "INR"
  }
}
```

### Submit Job Application (Public)
```bash
POST /api/hiring/applications
Content-Type: application/json

{
  "jobPostingId": "job_id_here",
  "applicantName": "John Doe",
  "applicantEmail": "john@example.com",
  "applicantPhone": "+91-9876543210",
  "resumeUrl": "https://cloudinary.com/resume.pdf",
  "coverLetter": "I am interested in this position..."
}
```

## 🔧 Configuration

### Environment Variables
```env
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
MONGO_URI=mongodb://localhost:27017/vds
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### CORS Configuration
- Production: `https://vikramdesignstudio.com`
- Development: `http://localhost:5173`
- Supports credentials for authentication

## 📝 Notes

1. **Activity Logging**: All admin actions are automatically logged for audit purposes
2. **Email Integration**: Professional email templates for job applications
3. **Role-Based Access**: Granular permissions based on user roles
4. **File Uploads**: Resume uploads supported via Cloudinary integration
5. **Pagination**: All list endpoints support pagination
6. **Error Handling**: Comprehensive error handling with meaningful messages
7. **Rate Limiting**: Applied to authentication endpoints
8. **Data Validation**: Input validation on all endpoints

## 🎯 Next Steps

1. **Frontend Integration**: Connect with React admin dashboard
2. **File Upload**: Implement resume upload functionality
3. **Email Templates**: Customize email templates for branding
4. **Analytics**: Add more detailed analytics and reporting
5. **Notifications**: Real-time notifications for admin actions
6. **Backup**: Implement automated database backups
7. **Monitoring**: Add application monitoring and logging
