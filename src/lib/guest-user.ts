import { prisma } from './prisma';

// Guest user ID for unauthenticated usage
export const GUEST_USER_ID = 'guest-user';

// Ensure guest user exists in database
export async function ensureGuestUser() {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: GUEST_USER_ID },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: GUEST_USER_ID,
          email: 'guest@astra.local',
          name: 'Guest User',
        },
      });
    }
  } catch (error) {
    console.error('Error ensuring guest user:', error);
  }
}
