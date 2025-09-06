# VDS Backend Implementation Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Models](#database-models)
4. [API Endpoints](#api-endpoints)
5. [Authentication & Authorization](#authentication--authorization)
6. [File Upload System](#file-upload-system)
7. [Validation & Error Handling](#validation--error-handling)
8. [Environment Configuration](#environment-configuration)
9. [Project Structure](#project-structure)
10. [Frontend Integration Guide](#frontend-integration-guide)

---

## 🎯 Overview

This backend system provides a complete REST API for the Vikram Design Studio (VDS) project management system. It includes:

- **Project Management**: Full CRUD operations for architectural projects
- **Authentication**: JWT-based admin authentication system
- **File Uploads**: Image handling for project previews
- **Content Management**: Rich content blocks with text and images
- **Search & Filtering**: Advanced project search capabilities
- **Role-Based Access**: Admin and Super Admin roles

---

## 🏗️ Architecture

### Technology Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer middleware
- **Password Hashing**: bcryptjs
- **Validation**: Custom middleware

### Design Patterns
- **MVC Architecture**: Controllers, Models, Routes separation
- **Middleware Pattern**: Authentication, validation, error handling
- **Repository Pattern**: Mongoose models for data access
- **JWT Strategy**: Stateless authentication

---

## 🗄️ Database Models

### 1. Project Model (`src/models/Project.model.ts`)

```typescript
interface IProject {
  name: string;                    // Project name (required)
  location: string;                // Project location (required)
  year?: string;                   // Project year (optional)
  status: 'Ongoing' | 'Completed' | 'On Hold';  // Project status (required)
  category: string;                // Project category (required)
  subCategory?: string;            // Project subcategory (optional)
  client: string;                  // Client name (required)
  collaborators: string;           // Collaborators (required)
  projectTeam: string;             // Project team (required)
  tags: string[];                  // Project tags (array)
  keyDate: string;                 // Key project date (required)
  previewImageUrl?: string;        // Preview image URL (optional)
  sections: IProjectSection[];     // Content blocks (array)
  createdAt: Date;                 // Creation timestamp
  updatedAt: Date;                 // Update timestamp
}

interface IProjectSection {
  type: 'text' | 'image';          // Content type
  content: string;                 // Content (text or image URL)
}
```

### 2. AdminUser Model (`src/models/AdminUser.model.ts`)

```typescript
interface IAdminUser {
  email: string;                   // Admin email (required, unique)
  password: string;                // Hashed password (required)
  name?: string;                   // Admin name (optional)
  role: 'admin' | 'super_admin';   // User role (default: admin)
  isActive: boolean;               // Account status (default: true)
  lastLogin?: Date;                // Last login timestamp
  createdAt: Date;                 // Creation timestamp
  updatedAt: Date;                 // Update timestamp
}
```

---

## 🔌 API Endpoints

### Public Routes (No Authentication Required)

#### Projects
- **GET** `/api/projects` - Get all projects
- **GET** `/api/projects/search` - Search projects with filters
- **GET** `/api/projects/:id` - Get specific project by ID

#### Authentication
- **POST** `/api/auth/register` - Register new admin user
- **POST** `/api/auth/login` - Admin login

### Protected Routes (Authentication Required)

#### Projects (Admin Only)
- **POST** `/api/projects` - Create new project
- **PUT** `/api/projects/:id` - Update existing project
- **DELETE** `/api/projects/:id` - Delete project
- **PATCH** `/api/projects/:id/status` - Toggle project status

#### User Management (Admin Only)
- **GET** `/api/auth/profile` - Get current user profile
- **PUT** `/api/auth/profile` - Update user profile
- **PUT** `/api/auth/change-password` - Change user password

---

## 🔐 Authentication & Authorization

### JWT Implementation
- **Token Generation**: Upon successful login/registration
- **Token Validation**: Middleware checks on protected routes
- **Token Expiry**: Configurable (default: 7 days)
- **Role-Based Access**: Admin and Super Admin roles

### Security Features
- **Password Hashing**: bcryptjs with salt rounds (12)
- **Input Validation**: Email format, password strength
- **Account Status**: Active/inactive user management
- **Last Login Tracking**: User activity monitoring

### Authentication Flow
1. User provides email/password
2. Server validates credentials
3. JWT token generated and returned
4. Client includes token in Authorization header
5. Protected routes validate token and user status

---

## 📁 File Upload System

### Multer Configuration
- **Storage**: Local disk storage
- **Destination**: `uploads/previews/` directory
- **File Naming**: Timestamp + random number + extension
- **File Filtering**: Images only (jpg, png, gif, etc.)
- **Size Limit**: 5MB maximum

### Upload Process
1. Client sends multipart/form-data with `preview` field
2. Multer processes and saves file
3. File path stored in database
4. Static serving at `/uploads/previews/filename`

### Supported File Types
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

---

## ✅ Validation & Error Handling

### Input Validation
- **Project Fields**: Required field validation
- **Email Format**: Regex validation for email addresses
- **Password Strength**: Minimum 6 characters
- **File Types**: Image file validation
- **JSON Fields**: Tags and sections array validation

### Error Handling
- **Global Error Handler**: Centralized error processing
- **MongoDB Errors**: Duplicate key, validation errors
- **JWT Errors**: Token expiration, invalid tokens
- **File Upload Errors**: Size limits, file type restrictions

### Error Response Format
```json
{
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

---

## ⚙️ Environment Configuration

### Required Environment Variables
```env
# Server Configuration
PORT=5002
CLIENT_ORIGIN=http://localhost:5173

# Database
MONGO_URI=mongodb+srv://user:password@cluster/database

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# File Uploads
UPLOAD_DIR=uploads
```

### Environment Validation
- Server validates required variables on startup
- Graceful shutdown if critical variables missing
- Development vs production configurations

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.ts                 # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.ts    # Authentication logic
│   │   └── project.controller.ts # Project CRUD operations
│   ├── middlewares/
│   │   ├── auth.middleware.ts    # JWT authentication
│   │   ├── error.middleware.ts   # Global error handling
│   │   ├── upload.ts             # File upload handling
│   │   └── validation.middleware.ts # Input validation
│   ├── models/
│   │   ├── AdminUser.model.ts    # Admin user schema
│   │   └── Project.model.ts      # Project schema
│   ├── routes/
│   │   ├── auth.routes.ts        # Authentication routes
│   │   └── project.routes.ts     # Project routes
│   └── server.ts                 # Express server setup
├── uploads/                      # File upload directory
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # Setup instructions
```

---

## 🔗 Frontend Integration Guide

### 1. Project Creation (AddProject Form)

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  
  // Required fields
  formData.append('name', formData.name);
  formData.append('location', formData.location);
  formData.append('status', formData.status);
  formData.append('category', formData.category);
  formData.append('client', formData.client);
  formData.append('projectTeam', formData.projectTeam);
  formData.append('collaborators', formData.collaborators);
  formData.append('keyDate', formData.keyDate);
  
  // Optional fields
  if (formData.subCategory) formData.append('subCategory', formData.subCategory);
  if (formData.year) formData.append('year', formData.year);
  
  // Arrays as JSON strings
  formData.append('tags', JSON.stringify(formData.tags));
  formData.append('sections', JSON.stringify(convertBlocksToSections(blocks)));
  
  // Preview image
  if (formData.preview) {
    formData.append('preview', formData.preview);
  }
  
  const response = await fetch('http://localhost:5002/api/projects', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}` // Admin token required
    },
    body: formData
  });
  
  const result = await response.json();
  // Handle response
};
```

### 2. Project Listing (Projects Table)

```javascript
const fetchProjects = async () => {
  const response = await fetch('http://localhost:5002/api/projects');
  const projects = await response.json();
  // Update state with projects
};

const searchProjects = async (query, filters) => {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (filters.category) params.append('category', filters.category);
  if (filters.status) params.append('status', filters.status);
  if (filters.year) params.append('year', filters.year);
  
  const response = await fetch(`http://localhost:5002/api/projects/search?${params}`);
  const projects = await response.json();
  // Update state with filtered projects
};
```

### 3. Authentication Integration

```javascript
const login = async (email, password) => {
  const response = await fetch('http://localhost:5002/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const { user, token } = await response.json();
  
  // Store token in localStorage or state management
  localStorage.setItem('adminToken', token);
  localStorage.setItem('adminUser', JSON.stringify(user));
  
  return { user, token };
};

// Include token in protected requests
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
  'Content-Type': 'application/json'
};
```

### 4. Field Mapping Considerations

**Frontend → Backend Field Mapping:**
- `title` → `name`
- `project_team` → `projectTeam`
- `description` → Use `sections` array with text blocks

**Response Aliases (Optional):**
You can modify the backend to return aliases for frontend compatibility:

```javascript
// In project controller, add response transformation
const projectResponse = {
  ...project.toObject(),
  title: project.name,
  project_team: project.projectTeam,
  description: project.sections.find(s => s.type === 'text')?.content || ''
};
```

---

## 🚀 Getting Started

### 1. Environment Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Create First Admin User
```bash
curl -X POST http://localhost:5002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vds.com","password":"admin123","name":"Admin User"}'
```

---

## 📊 API Response Examples

### Successful Project Creation
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "name": "Luxury Villa",
  "location": "Mumbai, India",
  "status": "Completed",
  "category": "Residential",
  "client": "Private Owner",
  "projectTeam": "Architect Team A",
  "collaborators": "Interior Designers",
  "previewImageUrl": "/uploads/previews/1693123456789-123456789.jpg",
  "sections": [
    {
      "type": "text",
      "content": "This luxurious villa features modern architecture..."
    },
    {
      "type": "image",
      "content": "https://example.com/image1.jpg"
    }
  ],
  "createdAt": "2023-08-28T10:30:00.000Z",
  "updatedAt": "2023-08-28T10:30:00.000Z"
}
```

### Authentication Response
```json
{
  "message": "Login successful",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "email": "admin@vds.com",
    "name": "Admin User",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🔧 Development Notes

### Current Limitations
1. **Content Block Images**: Currently expects external URLs for block images
2. **File Cleanup**: No automatic cleanup of orphaned uploaded files
3. **Rate Limiting**: No rate limiting implemented
4. **Logging**: Basic console logging only

### Future Enhancements
1. **Image Processing**: Resize/optimize uploaded images
2. **Cloud Storage**: AWS S3 or Cloudinary integration
3. **Email Notifications**: Project status change notifications
4. **Audit Logs**: Track all project modifications
5. **Bulk Operations**: Bulk project import/export
6. **Advanced Search**: Full-text search with MongoDB Atlas Search

---

## 🐛 Troubleshooting

### Common Issues
1. **MongoDB Connection**: Check MONGO_URI format and network access
2. **File Uploads**: Ensure uploads directory has write permissions
3. **CORS Errors**: Verify CLIENT_ORIGIN matches frontend URL
4. **JWT Errors**: Check JWT_SECRET is set and consistent
5. **Port Conflicts**: Change PORT if 5002 is already in use

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev
```

---

This documentation covers the complete backend implementation. The system is production-ready with proper authentication, validation, and error handling. All endpoints are tested and follow RESTful conventions.

