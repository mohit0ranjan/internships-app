import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'ADMIN' | 'APPLICANT';
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    role: 'ADMIN' | 'APPLICANT';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'ADMIN' | 'APPLICANT';
  }
}
