import NextAuth from 'next-auth';

declare module 'next-auth' {
    interface Session {
        accessToken?: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }

    interface User {
        accessToken?: string;
        id: string;
        email: string;
        name: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken?: string;
    }
}
