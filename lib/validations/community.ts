import * as z from 'zod';

export const CommunityValidation = z.object({
  image: z.string().url(),
  communityName: z.string().min(3).max(30),
  bio: z.string().min(3).max(100),
});
