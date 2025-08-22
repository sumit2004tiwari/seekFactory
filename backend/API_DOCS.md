# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new supplier/user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "companyName": "ABC Manufacturing",
  "phone": "+1234567890",
  "businessType": "manufacturer",
  "role": "supplier"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "companyName": "ABC Manufacturing",
      "phone": "+1234567890",
      "businessType": "manufacturer",
      "role": "supplier",
      "isVerified": false,
      "isEmailVerified": false,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Login User
**POST** `/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Login successful",
  "token": "jwt_token_here",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "supplier",
      "lastLogin": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Get Current User
**GET** `/auth/me`

Get currently authenticated user's profile.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "supplier",
      "companyName": "ABC Manufacturing"
    }
  }
}
```

### Update Profile
**PUT** `/auth/profile`

Update user profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "companyName": "XYZ Manufacturing",
  "phone": "+1987654321",
  "website": "https://xyz-manufacturing.com",
  "description": "Leading manufacturer of industrial equipment"
}
```

### Logout
**POST** `/auth/logout`

Logout current user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

## Error Responses

All endpoints may return error responses in the following format:

**Response (4xx/5xx):**
```json
{
  "status": "error",
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are valid for 7 days by default and are returned upon successful login or registration.
