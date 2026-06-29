# API Documentation

The REST API powers the Next.js Client Components. All endpoints accept and return `application/json`.

## Base URL
`/api`

## Authentication
All protected routes verify NextAuth JWT tokens server-side.

---

### Student Endpoints

#### `GET /api/student/dashboard`
Fetches the primary dashboard statistics.
- **Response**: `{ application: Object, attendanceCount: number, progressCount: number, certificate: Object | null }`
- **Errors**: `401 Unauthorized`, `404 Application Not Found`

#### `GET /api/student/attendance`
Retrieves the student's attendance history and stats.
- **Response**: `{ checkedInToday: boolean, stats: Object, history: Array }`

#### `POST /api/student/attendance`
Marks the student as present for the current day.
- **Payload**: None
- **Response**: `{ success: boolean, record: Object }`
- **Errors**: `400 Already checked in today`

#### `POST /api/student/progress`
Submits a weekly GitHub progress report.
- **Payload**: `{ weekNumber: number, githubUrl?: string, summary: string }`
- **Response**: `{ success: boolean, progress: Object }`
- **Validation**: Strict Zod validation on URLs and strings.

---

### Admin Endpoints

#### `GET /api/admin/dashboard`
Fetches high-level metrics for the admin console.
- **Response**: `{ stats: Object, recentApplications: Array, recentTickets: Array }`

#### `POST /api/admin/workspace/create`
Generates a portal account for a selected applicant.
- **Payload**: `{ applicationId: string }`
- **Response**: `{ success: boolean, password: string, email: string }`
- **Behavior**: Auto-generates a secure password, hashes it, and updates application status to `JOINED`.

#### `POST /api/admin/certificates/generate`
Generates a completion certificate for a student.
- **Payload**: `{ applicationId: string, grade: string }`
- **Response**: `{ success: boolean, certificate: Object }`
- **Validation**: Requires `status === 'COMPLETED'`.
