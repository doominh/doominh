import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(100),
  fullname: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10).max(12).regex(/^\d+$/),
  role: z.enum(['chef', 'employee']),
  branch: z.string().min(1)
});

export const loginSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(100)
});
