# 🔌 AI Job Chommie API Documentation

Welcome to the AI Job Chommie API! This RESTful API powers our intelligent job matching platform and provides access to South Africa's most comprehensive AI-driven job search capabilities.

## 🌟 Base URL

```
Production: https://api.aijobchommie.co.za/v1
Development: http://localhost:3001/api/v1
```

## 🔐 Authentication

All API requests require authentication using JWT tokens.

### Get Access Token

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user123",
      "email": "user@example.com",
      "name": "John Doe",
      "subscription": "premium"
    }
  }
}
```

### Using the Token

Include the token in all subsequent requests:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 👤 User Management

### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "location": "Cape Town",
  "phone": "+27123456789"
}
```

### Get User Profile

```http
GET /users/profile
Authorization: Bearer {token}
```

### Update User Profile

```http
PUT /users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Smith",
  "skills": ["React", "Node.js", "Python"],
  "experience": "5+ years",
  "location": "Johannesburg"
}
```

---

## 💼 Job Management

### Search Jobs

Our AI-powered job search with intelligent matching:

```http
GET /jobs/search?query=software%20developer&location=cape%20town&page=1&limit=20
Authorization: Bearer {token}
```

**Query Parameters:**
- `query` (string): Job title, skills, or keywords
- `location` (string): City or province in South Africa
- `experience` (string): "entry", "mid", "senior", "executive"
- `salary_min` (number): Minimum salary in ZAR
- `salary_max` (number): Maximum salary in ZAR
- `job_type` (string): "full-time", "part-time", "contract", "remote"
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 20, max: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "job123",
        "title": "Senior React Developer",
        "company": "Tech Innovators SA",
        "location": "Cape Town, Western Cape",
        "salary": {
          "min": 45000,
          "max": 65000,
          "currency": "ZAR",
          "period": "monthly"
        },
        "description": "Join our innovative team...",
        "requirements": ["React", "TypeScript", "5+ years experience"],
        "posted_date": "2025-08-04T10:00:00Z",
        "application_deadline": "2025-08-25T23:59:59Z",
        "ai_match_score": 92,
        "match_reasons": [
          "Perfect skill alignment with React expertise",
          "Location preference match",
          "Salary within desired range"
        ]
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 15,
      "total_results": 287,
      "has_next": true,
      "has_prev": false
    },
    "filters_applied": {
      "query": "software developer",
      "location": "cape town"
    }
  }
}
```

### Get Job Details

```http
GET /jobs/{job_id}
Authorization: Bearer {token}
```

### Get AI Job Recommendations

Personalized job recommendations based on user profile:

```http
GET /jobs/recommendations?limit=10
Authorization: Bearer {token}
```

---

## 📄 CV Management

### Upload CV

```http
POST /cv/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "cv_file": [File: PDF/DOC/DOCX],
  "parse_with_ai": true
}
```

### Get CV Analysis

AI-powered CV analysis and optimization suggestions:

```http
GET /cv/analysis
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overall_score": 78,
    "strengths": [
      "Strong technical skill set",
      "Relevant work experience",
      "Clear career progression"
    ],
    "improvements": [
      "Add more quantifiable achievements",
      "Include industry-specific keywords",
      "Optimize for ATS scanning"
    ],
    "skills_extracted": [
      "React", "Node.js", "Python", "JavaScript", "SQL"
    ],
    "experience_years": 5,
    "ai_suggestions": {
      "keyword_optimization": ["agile", "scrum", "microservices"],
      "achievement_enhancement": [
        "Quantify your project impacts",
        "Add metrics to accomplishments"
      ]
    }
  }
}
```

### Generate Cover Letter

AI-generated, job-specific cover letters:

```http
POST /cv/cover-letter
Authorization: Bearer {token}
Content-Type: application/json

{
  "job_id": "job123",
  "tone": "professional", // "professional", "casual", "enthusiastic"
  "length": "medium" // "short", "medium", "long"
}
```

---

## 🤖 AI Features

### Skill Gap Analysis

Identify skills needed for career advancement:

```http
GET /ai/skill-gap?target_role=senior%20developer
Authorization: Bearer {token}
```

### Career Path Suggestions

AI-driven career progression recommendations:

```http
GET /ai/career-path
Authorization: Bearer {token}
```

### Market Insights

South African job market intelligence:

```http
GET /ai/market-insights?location=johannesburg&role=developer
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "location": "Johannesburg",
    "role": "Developer",
    "market_demand": "high",
    "average_salary": {
      "junior": { "min": 25000, "max": 35000 },
      "mid": { "min": 40000, "max": 60000 },
      "senior": { "min": 65000, "max": 95000 }
    },
    "trending_skills": [
      "React", "Python", "AWS", "Docker", "Kubernetes"
    ],
    "growth_projection": "+12% over next 12 months",
    "top_hiring_companies": [
      "Discovery", "Standard Bank", "Naspers", "Capitec"
    ]
  }
}
```

---

## 📊 Analytics & Reporting

### User Dashboard Stats

```http
GET /analytics/dashboard
Authorization: Bearer {token}
```

### Application Tracking

```http
GET /applications/tracking
Authorization: Bearer {token}
```

---

## 💳 Subscription Management

### Get Subscription Status

```http
GET /subscription/status
Authorization: Bearer {token}
```

### Upgrade Subscription

```http
POST /subscription/upgrade
Authorization: Bearer {token}
Content-Type: application/json

{
  "plan": "premium", // "basic", "premium", "enterprise"
  "payment_method": "paystack_token_here"
}
```

---

## 🔔 Notifications

### Get Notifications

```http
GET /notifications?unread_only=true
Authorization: Bearer {token}
```

### Mark as Read

```http
PUT /notifications/{notification_id}/read
Authorization: Bearer {token}
```

---

## 📱 Mobile API Endpoints

Special endpoints optimized for mobile app usage:

### Mobile Dashboard

```http
GET /mobile/dashboard
Authorization: Bearer {token}
```

### Offline Sync

```http
POST /mobile/sync
Authorization: Bearer {token}
Content-Type: application/json

{
  "last_sync": "2025-08-04T10:00:00Z",
  "cached_data": {...}
}
```

---

## 🚨 Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "The provided email or password is incorrect",
    "details": {
      "field": "password",
      "received": "[REDACTED]"
    }
  },
  "timestamp": "2025-08-04T12:00:00Z",
  "request_id": "req_123456789"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_CREDENTIALS` | 401 | Login credentials are incorrect |
| `TOKEN_EXPIRED` | 401 | JWT token has expired |
| `INSUFFICIENT_PERMISSIONS` | 403 | User lacks required permissions |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource doesn't exist |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `VALIDATION_ERROR` | 422 | Request data validation failed |
| `SUBSCRIPTION_REQUIRED` | 402 | Premium feature requires subscription |
| `SERVER_ERROR` | 500 | Internal server error |

---

## 📈 Rate Limits

| Endpoint Category | Requests per Hour | Premium Multiplier |
|------------------|-------------------|-------------------|
| Authentication | 100 | 1x |
| Job Search | 1000 | 3x |
| AI Features | 200 | 5x |
| CV Operations | 50 | 2x |
| General API | 2000 | 2x |

---

## 🧪 Testing

### Postman Collection

Import our comprehensive Postman collection:
```
https://api.aijobchommie.co.za/docs/postman/collection.json
```

### API Playground

Interactive API testing interface:
```
https://api.aijobchommie.co.za/playground
```

---

## 📚 SDKs & Libraries

### JavaScript/Node.js

```bash
npm install @aijobchommie/sdk
```

```javascript
import { AiJobChommieAPI } from '@aijobchommie/sdk';

const api = new AiJobChommieAPI({
  token: 'your-jwt-token',
  environment: 'production' // or 'development'
});

const jobs = await api.jobs.search({
  query: 'developer',
  location: 'cape town'
});
```

### Python

```bash
pip install aijobchommie-python
```

```python
from aijobchommie import AiJobChommieAPI

api = AiJobChommieAPI(token='your-jwt-token')
jobs = api.jobs.search(query='developer', location='cape town')
```

---

## 🔒 Security

### HTTPS Only
All API communications must use HTTPS.

### Input Validation
All inputs are validated and sanitized.

### SQL Injection Protection
Parameterized queries prevent SQL injection.

### XSS Protection
Output encoding prevents XSS attacks.

### CORS Policy
Configured for secure cross-origin requests.

---

## 📞 Support

- **📧 Email**: api-support@aijobchommie.co.za
- **📖 Documentation**: https://docs.aijobchommie.co.za
- **🐛 Issues**: https://github.com/FernandoSteyn/aijobchommie/issues
- **💬 Community**: https://github.com/FernandoSteyn/aijobchommie/discussions

---

## 📝 Changelog

### v1.3.0 (Latest)
- ✨ Enhanced AI job matching algorithm
- 🚀 Improved mobile API performance
- 📱 New Android APK support endpoints
- 🔧 Better error handling and validation

### v1.2.0
- 🤖 Added career path suggestions
- 📊 Market insights API
- 🔔 Real-time notifications
- 💳 Paystack payment integration

### v1.1.0
- 📄 CV analysis and optimization
- 🎯 Skill gap analysis
- 🔍 Advanced search filters
- 📈 User analytics dashboard

---

*API Documentation last updated: August 4, 2025*
*Built with ❤️ for South African developers and job seekers*
