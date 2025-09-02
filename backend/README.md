# VDS Backend (Projects API)

## Setup
1. Copy `.env.example` to `.env` and fill values:

PORT=5002
CLIENT_ORIGIN=http://localhost:5173
MONGO_URI=your_mongodb_uri
UPLOAD_DIR=uploads

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

## Notes
- Uploaded preview images are served under `/uploads/previews/<filename>`
- Adjust `CLIENT_ORIGIN` for CORS based on your frontend dev server

