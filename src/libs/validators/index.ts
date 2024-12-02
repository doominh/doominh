import { z } from 'zod';

// this is a library of validators from zod
export const createTableSchema = z.object({
  name: z.string().trim().min(1)
});

export const categoryMenuSchema = z.object({
  name: z.string().nonempty('Loại không được để trống').trim().min(2, {
    message: 'Tên món ăn phải có ít nhất 2 ký tự'
  })
});
