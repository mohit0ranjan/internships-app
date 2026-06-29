# Admin Manual

Welcome to the Administrator Manual for the CSDAC Internship Management Portal. This guide explains how to manage the lifecycle of applicants, students, and support tickets.

## Dashboard Overview
The dashboard provides a high-level view of:
- Total active students
- Pending applications requiring review
- Open support tickets
- Today's attendance numbers

## 1. Reviewing Applicants
Navigate to **Applicants** in the sidebar.
- Here you will see a list of candidates who have applied via the public landing page.
- You can filter by status (PENDING, SELECTED, REJECTED).
- **Action**: Once a candidate clears the screening process, change their status to `SELECTED`.

## 2. Generating Workspaces
Navigate to **Workspace Generation**.
- Only applicants marked as `SELECTED` will appear here.
- Click **Generate Workspace**. The system will:
  1. Auto-generate a secure random password.
  2. Create a User account for the portal.
  3. Change the applicant's status to `JOINED`.
- **Action**: Copy the generated credentials and securely send them to the student via email.

## 3. Managing Projects and Progress
Navigate to **Progress Tracking**.
- View all students currently in active batches.
- Click on a student to see their weekly GitHub submissions.
- **Action**: You can add mentor remarks to their submissions, or flag them if revision is needed.

## 4. Support Tickets
Navigate to **Support Tickets**.
- Students can raise tickets for administrative or technical issues.
- You will see a queue of tickets, color-coded by priority/status.
- **Action**: Select a ticket to view the conversation history. Reply directly from the admin panel. Once resolved, click **Mark as Resolved** to close the ticket.

## 5. Generating Certificates
Navigate to **Certificates**.
- Only students who meet the attendance threshold (e.g., 75%) and have completed their weeks will be eligible.
- **Action**: Select the student, input their final grade (A, B+, etc.), and click generate. This permanently issues a unique certificate number that can be verified publicly.
