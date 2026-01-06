# 🗄️ Complete Database Schema - VDS Admin Dashboard Backend

## **Overview**

This document provides a comprehensive overview of all database models, relationships, indexes, and validation rules for the VDS Admin Dashboard backend system.

---

## **📋 Existing Models (Already Present):**

### 1. **AdminUser Model**

```typescript
interface IAdminUser extends Document {
  email: string; // Required, unique, lowercase
  password: string; // Required, min 6 chars, hashed
  name?: string; // Optional admin name
  role: "admin" | "super_admin"; // User role (default: admin)
  isActive: boolean; // Account status (default: true)
  lastLogin?: Date; // Last login timestamp
  createdAt: Date; // Auto-generated
  updatedAt: Date; // Auto-generated
  comparePassword(candidatePassword: string): Promise<boolean>;
}
```

**Schema Details:**

- **Email**: Required, unique, lowercase, trimmed
- **Password**: Required, minimum 6 characters, auto-hashed with bcrypt
- **Role**: Enum ['admin', 'super_admin'], default 'admin'
- **isActive**: Boolean, default true
- **lastLogin**: Optional Date for tracking user activity

**Indexes:**

- `{ email: 1 }` (unique)
- `{ role: 1 }`
- `{ isActive: 1 }`

---

### 2. **Project Model**

```typescript
interface IProjectSection {
  type: "text" | "image" | "gif" | "video";
  content: string; // text content, image URL, or GIF URL
  publicId?: string; // Cloudinary public id for images/GIFs
}

interface IProject extends Document {
  name: string; // Project Name
  location: string;
  year?: string;
  status: "On-site" | "Design stage" | "Completed" | "Unbuilt";
  category: string;
  subCategory?: string;
  client: string;
  collaborators: string;
  projectLeaders: string[]; // Array of project leaders
  projectTeam: string;
  tags: string[]; // Project tags array
  keyDate: string; // ISO date string
  previewImageUrl?: string; // Preview image URL
  previewImagePublicId?: string; // Cloudinary public id
  sections: IProjectSection[]; // Content blocks
  sizeM2FT2?: string; // Project size
  createdAt: Date;
  updatedAt: Date;
}
```

**Schema Details:**

- **Status**: Enum ['On-site', 'Design stage', 'Completed', 'Unbuilt']
- **Project Leaders**: Array of strings for multiple leaders
- **Tags**: Array of strings for categorization
- **Sections**: Array of content blocks with type and content
- **Cloudinary Integration**: Public IDs for image management

**Indexes:**

- `{ createdAt: -1 }` (creation date)
- `{ status: 1 }`
- `{ category: 1 }`
- `{ tags: 1 }`

---

### 3. **Tags Model**

```typescript
interface ITags extends Document {
  name: string; // Tag name
  category?: string; // Optional category
  createdAt: Date;
  updatedAt: Date;
}
```

**Schema Details:**

- **Name**: Required, unique tag name
- **Category**: Optional categorization for tags

**Indexes:**

- `{ name: 1 }` (unique)
- `{ category: 1 }`

---

## **🆕 New Models (Just Created):**

### 4. **ActivityLog Model**

```typescript
interface IActivityLog extends Document {
  userId: string; // Admin user who performed action
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT";
  entityType: "PROJECT" | "USER" | "CONTENT" | "AUTH" | "JOB" | "APPLICATION";
  entityId?: string; // ID of affected entity
  description: string; // Human-readable description
  timestamp: Date; // When action occurred
  metadata?: Record<string, any>; // Additional context data
  createdAt: Date; // Auto-generated
  updatedAt: Date; // Auto-generated
}
```

**Schema Details:**

- **User Tracking**: Every action linked to a user
- **Action Types**: Comprehensive action tracking
- **Entity Types**: Tracks what type of entity was affected
- **Metadata**: Flexible storage for additional context
- **Audit Trail**: Complete audit trail for compliance

**Indexes:**

- `{ userId: 1, timestamp: -1 }` (user activity queries)
- `{ entityType: 1, entityId: 1 }` (entity-specific queries)
- `{ timestamp: -1 }` (recent activity)

**Validation Rules:**

- `userId`: Required, references AdminUser
- `action`: Required, enum validation
- `entityType`: Required, enum validation
- `description`: Required string
- `timestamp`: Auto-generated Date

---

### 5. **WebsiteContent Model**

```typescript
interface IWebsiteContent extends Document {
  page: "HOME" | "ABOUT" | "TEAM" | "CONTACT" | "CAREERS";
  section: string; // Content section identifier
  title?: string; // Optional title
  content: string; // Main content
  contentType: "TEXT" | "HTML" | "MARKDOWN";
  isActive: boolean; // Whether content is live
  lastModifiedBy: string; // Admin user who last modified
  lastModifiedAt: Date; // Last modification timestamp
  createdAt: Date; // Auto-generated
  updatedAt: Date; // Auto-generated
}
```

**Schema Details:**

- **Page Organization**: Content organized by website pages
- **Section Management**: Granular content sections within pages
- **Content Types**: Support for different content formats
- **Version Tracking**: Track who modified content and when
- **Active Status**: Control content visibility

**Indexes:**

- `{ page: 1, section: 1 }` (page content queries)
- `{ isActive: 1 }` (active content queries)
- `{ lastModifiedBy: 1 }` (user modification tracking)

**Validation Rules:**

- `page`: Required, enum ['HOME', 'ABOUT', 'TEAM', 'CONTACT', 'CAREERS']
- `section`: Required, trimmed string
- `content`: Required string
- `contentType`: Enum ['TEXT', 'HTML', 'MARKDOWN'], default 'TEXT'
- `isActive`: Boolean, default true

---

### 6. **JobPosting Model**

```typescript
interface IJobPosting extends Document {
  title: string; // Job title
  department: string; // Department name
  location: string; // Job location
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  experienceLevel: "ENTRY" | "MID" | "SENIOR" | "LEAD";
  description: string; // Job description
  requirements: string[]; // Array of requirements
  responsibilities: string[]; // Array of responsibilities
  benefits: string[]; // Array of benefits
  salaryRange?: {
    min: number;
    max: number;
    currency: string; // Default: 'INR'
  };
  isActive: boolean; // Whether job is active
  applicationDeadline?: Date; // Optional deadline
  createdBy: string; // Admin user who created
  createdAt: Date; // Auto-generated
  updatedAt: Date; // Auto-generated
}
```

**Schema Details:**

- **Employment Types**: Full-time, part-time, contract, internship
- **Experience Levels**: Entry, mid, senior, lead levels
- **Salary Ranges**: Optional salary information with currency
- **Application Deadlines**: Optional deadline management
- **Creator Tracking**: Track who created the job posting

**Indexes:**

- `{ isActive: 1, createdAt: -1 }` (active jobs by date)
- `{ department: 1, experienceLevel: 1 }` (job filtering)
- `{ employmentType: 1 }`
- `{ location: 1 }`

**Validation Rules:**

- `title`: Required, trimmed string
- `department`: Required, trimmed string
- `location`: Required, trimmed string
- `employmentType`: Required, enum validation
- `experienceLevel`: Required, enum validation
- `description`: Required string
- `requirements`: Array of strings
- `responsibilities`: Array of strings
- `benefits`: Array of strings

---

### 7. **JobApplication Model**

```typescript
interface IJobApplication extends Document {
  jobPostingId: string; // Reference to JobPosting
  applicantName: string; // Applicant's full name
  applicantEmail: string; // Applicant's email (lowercase)
  applicantPhone: string; // Applicant's phone number
  resumeUrl: string; // URL to uploaded resume
  coverLetter?: string; // Optional cover letter
  status: "PENDING" | "REVIEWED" | "SHORTLISTED" | "REJECTED" | "HIRED";
  appliedAt: Date; // When application was submitted
  reviewedAt?: Date; // When application was reviewed
  reviewedBy?: string; // Admin user who reviewed
  notes?: string; // Internal notes
  createdAt: Date; // Auto-generated
  updatedAt: Date; // Auto-generated
}
```

**Schema Details:**

- **Application Tracking**: Complete application lifecycle
- **Status Management**: Pending to hired status progression
- **Review Tracking**: Track who reviewed and when
- **Internal Notes**: Admin notes for internal use
- **Resume Management**: URL-based resume storage

**Indexes:**

- `{ jobPostingId: 1, status: 1 }` (job applications by status)
- `{ appliedAt: -1 }` (applications by date)
- `{ applicantEmail: 1 }` (duplicate application checks)
- `{ status: 1 }`

**Validation Rules:**

- `jobPostingId`: Required, references JobPosting
- `applicantName`: Required, trimmed string
- `applicantEmail`: Required, lowercase, trimmed
- `applicantPhone`: Required, trimmed string
- `resumeUrl`: Required string
- `status`: Enum validation, default 'PENDING'

---

## **🔗 Database Relationships:**

### **One-to-Many Relationships:**

#### **AdminUser Relationships:**

- **AdminUser** → **ActivityLog** (1:many)

  - One user can have many activity logs
  - Tracks all user actions for audit purposes

- **AdminUser** → **WebsiteContent** (1:many)

  - One user can modify many content pieces
  - Tracks content modification history

- **AdminUser** → **JobPosting** (1:many)

  - One user can create many job postings
  - Tracks job posting creation

- **AdminUser** → **JobApplication** (1:many)
  - One user can review many applications
  - Tracks application review history

#### **JobPosting Relationships:**

- **JobPosting** → **JobApplication** (1:many)
  - One job can have many applications
  - Links applications to specific jobs

### **Reference Fields:**

```typescript
// In ActivityLog
userId: string (ref: 'AdminUser')

// In WebsiteContent
lastModifiedBy: string (ref: 'AdminUser')

// In JobPosting
createdBy: string (ref: 'AdminUser')

// In JobApplication
jobPostingId: string (ref: 'JobPosting')
reviewedBy: string (ref: 'AdminUser')
```

---

## **📊 Database Indexes for Performance:**

### **ActivityLog Indexes:**

```javascript
{ userId: 1, timestamp: -1 }        // User activity queries
{ entityType: 1, entityId: 1 }      // Entity-specific queries
{ timestamp: -1 }                   // Recent activity queries
```

### **WebsiteContent Indexes:**

```javascript
{ page: 1, section: 1 }              // Page content queries
{ isActive: 1 }                     // Active content queries
{ lastModifiedBy: 1 }               // User modification tracking
```

### **JobPosting Indexes:**

```javascript
{ isActive: 1, createdAt: -1 }       // Active jobs by date
{ department: 1, experienceLevel: 1 } // Job filtering
{ employmentType: 1 }                  // Employment type filtering
{ location: 1 }                       // Location-based queries
```

### **JobApplication Indexes:**

```javascript
{ jobPostingId: 1, status: 1 }       // Job applications by status
{ appliedAt: -1 }                    // Applications by date
{ applicantEmail: 1 }                // Duplicate application checks
{ status: 1 }                        // Status-based queries
```

### **Project Indexes:**

```javascript
{
  createdAt: -1;
} // Projects by creation date
{
  status: 1;
} // Projects by status
{
  category: 1;
} // Projects by category
{
  tags: 1;
} // Projects by tags
```

### **AdminUser Indexes:**

```javascript
{
  email: 1;
} // Unique email constraint
{
  role: 1;
} // Role-based queries
{
  isActive: 1;
} // Active user queries
```

---

## **🔐 Schema Validation Rules:**

### **AdminUser Validation:**

- **Email**: Required, unique, lowercase, trimmed
- **Password**: Required, minimum 6 characters, auto-hashed with bcrypt
- **Role**: Enum ['admin', 'super_admin'], default 'admin'
- **isActive**: Boolean, default true
- **Name**: Optional, trimmed string

### **ActivityLog Validation:**

- **userId**: Required, references AdminUser
- **action**: Required, enum ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT']
- **entityType**: Required, enum ['PROJECT', 'USER', 'CONTENT', 'AUTH', 'JOB', 'APPLICATION']
- **description**: Required string
- **timestamp**: Auto-generated Date
- **metadata**: Optional object for additional context

### **WebsiteContent Validation:**

- **page**: Required, enum ['HOME', 'ABOUT', 'TEAM', 'CONTACT', 'CAREERS']
- **section**: Required, trimmed string
- **content**: Required string
- **contentType**: Enum ['TEXT', 'HTML', 'MARKDOWN'], default 'TEXT'
- **isActive**: Boolean, default true
- **title**: Optional, trimmed string

### **JobPosting Validation:**

- **title**: Required, trimmed string
- **department**: Required, trimmed string
- **location**: Required, trimmed string
- **employmentType**: Required, enum ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']
- **experienceLevel**: Required, enum ['ENTRY', 'MID', 'SENIOR', 'LEAD']
- **description**: Required string
- **requirements**: Array of strings
- **responsibilities**: Array of strings
- **benefits**: Array of strings
- **salaryRange**: Optional object with min, max, currency

### **JobApplication Validation:**

- **jobPostingId**: Required, references JobPosting
- **applicantName**: Required, trimmed string
- **applicantEmail**: Required, lowercase, trimmed
- **applicantPhone**: Required, trimmed string
- **resumeUrl**: Required string
- **status**: Enum ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'HIRED'], default 'PENDING'
- **coverLetter**: Optional string
- **notes**: Optional string

---

## **🚀 Database Features:**

### **Automatic Features:**

- **Timestamps**: All models have `createdAt` and `updatedAt`
- **Password Hashing**: AdminUser passwords auto-hashed with bcrypt
- **Activity Logging**: Automatic logging of all admin actions
- **Email Validation**: Proper email format validation
- **Index Optimization**: Strategic indexes for query performance

### **Data Integrity:**

- **Unique Constraints**: Email addresses, content sections
- **Reference Integrity**: Proper foreign key relationships
- **Validation**: Comprehensive input validation
- **Sanitization**: Data sanitization and trimming

### **Performance Optimizations:**

- **Compound Indexes**: Multi-field indexes for complex queries
- **Query Optimization**: Indexed fields for common query patterns
- **Pagination Support**: All list endpoints support pagination
- **Selective Fields**: Password fields excluded from default queries

### **Security Features:**

- **Role-Based Access**: Granular permissions system
- **Audit Trail**: Complete activity logging
- **Data Validation**: Input validation and sanitization
- **Reference Integrity**: Proper relationship management

---

## **📈 Query Performance:**

### **Optimized Query Patterns:**

- **User Activity**: `{ userId: 1, timestamp: -1 }` for user activity history
- **Recent Activity**: `{ timestamp: -1 }` for recent system activity
- **Active Content**: `{ isActive: 1 }` for live website content
- **Job Filtering**: `{ department: 1, experienceLevel: 1 }` for job searches
- **Application Status**: `{ jobPostingId: 1, status: 1 }` for application management

### **Pagination Support:**

- All list endpoints support pagination
- Efficient skip/limit queries with proper indexing
- Total count queries for pagination metadata

---

## **🔧 Maintenance & Monitoring:**

### **Database Maintenance:**

- **Index Monitoring**: Regular index usage analysis
- **Query Optimization**: Slow query identification and optimization
- **Data Cleanup**: Automated cleanup of old activity logs
- **Backup Strategy**: Regular database backups

### **Performance Monitoring:**

- **Query Performance**: Monitor slow queries
- **Index Usage**: Track index effectiveness
- **Connection Pooling**: Optimize database connections
- **Memory Usage**: Monitor database memory consumption

---

This comprehensive database schema provides a robust foundation for the VDS Admin Dashboard with proper relationships, validation, indexing, and performance optimizations. The schema supports all required functionality while maintaining data integrity and optimal performance.
