import NextAuth from 'next-auth';
import { authOptions } from '@/auth';

// Keep this handler simple — don't wrap it in try/catch or intercept errors.
// Custom error handling is done on the login page by reading the ?error= param.
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
