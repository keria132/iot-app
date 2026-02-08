import z, { ZodType } from 'zod';

type validateFormDataResult<T> = { status: true; data: z.infer<T> } | { status: false; error: string };

export const validateFormData = <T extends ZodType>(formData: FormData, schema: T): validateFormDataResult<T> => {
  const rawFormData = Object.fromEntries(formData.entries());
  const parsedFormData = schema.safeParse(rawFormData);

  if (!parsedFormData.success) {
    const errorMessages = parsedFormData.error.issues.reduce((acc, curr) => acc + curr.message + ', ', '');

    return { status: false, error: errorMessages };
  }

  return { status: true, data: parsedFormData.data };
};
