import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import type { NextRequest } from 'next/server';

if (!process.env.NEXTAUTH_SECRET) {
  console.warn('WARNING: NEXTAUTH_SECRET is not set. Auth will fail in production.');
}

function extractIp(req: any): string {
  const forwardedFor = req?.headers?.get?.('x-forwarded-for') || req?.headers?.['x-forwarded-for'];
  if (forwardedFor) {
    return Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor.split(',')[0].trim();
  }
  return req?.headers?.get?.('x-real-ip') || req?.headers?.['x-real-ip'] || req?.ip || 'unknown';
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password || !user.isActive) {
            if (user) {
              const ip = extractIp(req);
              await logLoginAttempt(user.id, 'FAILED', ip);
            }
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            const ip = extractIp(req);
            await prisma.user.update({
              where: { id: user.id },
              data: { lastLogin: new Date() }
            });
            await logLoginAttempt(user.id, 'SUCCESS', ip);
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          } else {
            const ip = extractIp(req);
            await logLoginAttempt(user.id, 'FAILED', ip);
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      // Re-validate isActive on every token refresh (every session access)
      // This ensures deactivated users are kicked out immediately
      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { isActive: true, role: true },
          });
          if (!dbUser || !dbUser.isActive) {
            // Returning null-like token will invalidate the session
            return { ...token, error: 'AccountDeactivated' };
          }
          // Keep role in sync in case it was changed
          token.role = dbUser.role;
        } catch {
          // DB error — allow token to pass rather than locking out all users
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Block sessions for deactivated accounts
      if ((token as any).error === 'AccountDeactivated') {
        return { ...session, user: undefined as any };
      }
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'ADMIN' | 'APPLICANT';
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { 
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-authjs.session-token' : 'authjs.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    }
  }
});

async function logLoginAttempt(userId: string, status: 'SUCCESS' | 'FAILED', ipAddress: string = 'unknown') {
  try {
    await prisma.loginHistory.create({
      data: {
        userId,
        status,
        ipAddress,
        userAgent: 'unknown',
      }
    });
  } catch (error) {
    console.error('Failed to log login attempt:', error);
  }
}
