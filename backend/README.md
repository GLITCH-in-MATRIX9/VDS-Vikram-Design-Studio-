# VDS Backend (Projects API)

## Setup
1. Create `.env` file with the following variables:

```env
# Server Configuration
PORT=5002
CLIENT_ORIGIN=http://localhost:5173

# Database
MONGO_URI=your_mongodb_uri

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# File Uploads
UPLOAD_DIR=uploads

# Email Configuration (Brevo)
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=your_brevo_login_email@example.com
EMAIL_PASS=your_smtp_key_here
EMAIL_FROM=your_verified_sender_email@example.com
```

2. Install dependencies:

npm install

3. Run in dev:

npm run dev

## Endpoints
- POST `/api/projects` (multipart/form-data)
  - Fields:
    - `name` (string, required)
    - `location` (string, required)
    - `year` (string, optional)
    - `status` ('Ongoing' | 'Completed' | 'On Hold', required)
    - `category` (string, required)
    - `subCategory` (string, optional)
    - `client` (string, required)
    - `collaborators` (string, required)
    - `projectTeam` (string, required)
    - `tags` (JSON string array, optional)
    - `keyDate` (string date, required)
    - `sections` (JSON string array of { type: 'text'|'image', content: string })
    - `preview` (file, optional) image upload for preview

- GET `/api/projects`
- GET `/api/projects/:id`

### Contact & Email
- POST `/api/contact` - Send contact form email
  - Fields: `name`, `email`, `subject`, `message`
  - Sends confirmation email to user and notification to admin
  - Rate limited: 5 requests per 15 minutes per IP
  - Input validation and sanitization included

## Email Configuration
The backend uses Brevo (formerly Sendinblue) for email services. Make sure to:
1. Create a Brevo account
2. Get your SMTP credentials
3. Add them to your `.env` file
4. Verify your sender email address

## Production Features
- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Comprehensive validation and sanitization
- **Error Handling**: Production-safe error responses
- **Email Templates**: Professional HTML email templates
- **Security**: CORS protection and input sanitization

## Notes
- Uploaded preview images are served under `/uploads/previews/<filename>`
- Adjust `CLIENT_ORIGIN` for CORS based on your frontend dev server
- Email service requires valid Brevo SMTP credentials
- Rate limiting is in-memory (for production, consider Redis)

