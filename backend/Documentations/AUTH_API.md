# Auth API

Base URL: `/api/auth`

Authentication uses JWT access tokens. Send the token in the `Authorization` header as `Bearer <token>` for protected endpoints.

Note on registration security:

- Public registration is allowed only for bootstrapping the very first user. If at least one admin user already exists, public `POST /register` is disabled and returns 403. The first user is created with the `super_admin` role. Subsequent accounts must be created via an admin-only flow (not included in this minimal hardening).

## Endpoints

### POST /register

Bootstrap a super admin account. Disabled once any user exists.

- Rate limit: 5 requests/hour per IP
- Validation: email format, password min length 6

Request body (JSON):

```json
{
  "email": "admin@example.com",
  "password": "string (>=6)",
  "name": "optional string"
}
```

Success response 201:

```json
{
  "message": "Super admin created successfully",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string | undefined",
    "role": "super_admin"
  },
  "token": "jwt-string"
}
```

Error responses:

- 400: duplicate email or validation errors
- 403: registration disabled after first admin
- 429: too many attempts
- 500: server error

---

### POST /login

Authenticate an admin and receive a JWT.

- Rate limit: 10 requests/15 minutes per IP
- Validation: email format, password min length 6

Request body (JSON):

```json
{
  "email": "admin@example.com",
  "password": "string"
}
```

Success response 200:

```json
{
  "message": "Login successful",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string | undefined",
    "role": "admin | super_admin"
  },
  "token": "jwt-string"
}
```

Error responses:

- 400: missing email/password
- 401: invalid credentials or account deactivated
- 429: too many attempts
- 500: server error

---

### GET /profile

Get the authenticated admin profile.

- Auth: Bearer token required

Headers:

- `Authorization: Bearer <token>`

Success response 200:

```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string | undefined",
    "role": "admin | super_admin",
    "isActive": true,
    "lastLogin": "ISO date | null",
    "createdAt": "ISO date"
  }
}
```

Error responses:

- 401: missing/invalid/expired token, deactivated account
- 404: user not found
- 500: server error

---

### PUT /profile

Update name and/or email of the authenticated admin.

- Auth: Bearer token required

Headers:

- `Authorization: Bearer <token>`

Request body (JSON):

```json
{
  "name": "optional string",
  "email": "optional string"
}
```

Success response 200:

```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string | undefined",
    "role": "admin | super_admin"
  }
}
```

Error responses:

- 400: validation errors
- 401: unauthorized
- 404: user not found
- 500: server error

---

### PUT /change-password

Change the authenticated admin's password.

- Auth: Bearer token required

Headers:

- `Authorization: Bearer <token)`

Request body (JSON):

```json
{
  "currentPassword": "string",
  "newPassword": "string (>=6)"
}
```

Success response 200:

```json
{
  "message": "Password changed successfully"
}
```

Error responses:

- 400: missing fields or invalid new password or incorrect current password
- 401: unauthorized
- 404: user not found
- 500: server error

## Authorization model

- Roles: `admin`, `super_admin`
- Project management endpoints require `admin` or `super_admin`
- This minimal hardening disables public registration after initial bootstrap.

## Headers and token usage

- Include access token as:
  - `Authorization: Bearer <jwt>`
- Token expiry is configured via `JWT_EXPIRES_IN` (default in this project: `90d`, see your `.env`).

## Common error payload shape

Errors from validation routes often look like:

```json
{
  "message": "Validation failed",
  "errors": ["Email is required", "Password must be at least 6 characters"]
}
```

Other errors commonly look like:

```json
{
  "message": "<error message>",
  "error": "<details>"
}
```

## Example usage

1) Login then call protected route

```http
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "secret123"
}
-> 200 { token: "..." }

GET /api/auth/profile
Authorization: Bearer <token>
-> 200 { user: { id, email, ... } }
```
