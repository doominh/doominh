import { z } from 'zod';

export const createMenuDetailSchema = z.object({
  category_id: z.string().refine(value => value !== 'none', {
    message: 'Chọn loại món ăn'
  }),
  name: z.string().nonempty('Mô tả không được để trống').trim().min(5, {
    message: 'Tên món ăn phải có ít nhất 5 ký tự'
  }),
  price: z
    .number({
      invalid_type_error: 'Giá tiền không được để trống'
    })
    .gte(1000, {
      message: 'Giá tiền phải lớn hơn 1000'
    }),
  description: z
    .string()
    .trim()
    .nonempty('Mô tả không được để trống')
    .refine(value => value.length > 10, {
      message: 'Mô tả phải có ít nhất 10 ký tự'
    }),
  image: z
    .any()
    .refine(file => file?.length >= 1, {
      message: 'Hình ảnh không được để trống'
    })
    .refine(file => file !== null && file !== undefined)
});
