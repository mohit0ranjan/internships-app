import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[\W_]/, 'Password must contain at least one special character');

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'), // Keep simple for login to not leak rules
});

export const workspaceCreateSchema = z.object({
  applicationId: z.string().cuid('Invalid application ID'),
  batchId: z.string().cuid('Invalid batch ID'),
});

export const certificateGenerateSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  internshipId: z.string().cuid('Invalid internship ID'),
});

export const githubUrlSchema = z.string().url().regex(/^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-_.]+$/, 'Must be a valid GitHub repository URL');

export const weeklyProgressSchema = z.object({
  projectId: z.string().cuid(),
  weekNumber: z.number().int().min(1).max(24),
  summary: z.string().min(50, 'Summary must be at least 50 characters').max(2000),
  githubLink: githubUrlSchema.optional().or(z.literal('')),
});
