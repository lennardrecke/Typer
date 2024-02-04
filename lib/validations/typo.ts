import * as z from 'zod';

export const TypoValidation = z.object({
  typo: z
    .string()
    .min(3, { message: 'Typo must be at least 3 characters long' }),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  typo: z
    .string()
    .min(3, { message: 'Typo must be at least 3 characters long' }),
});
