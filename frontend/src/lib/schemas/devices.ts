import { z } from 'zod';

export const AddDeviceSchema = z.object({
  name: z.string().trim().min(1, 'Device name is required'),
  ip: z.ipv4(),
  type: z.string().trim().min(1, 'Device type is required'), //TODO: Device type as enum
  room: z.string().optional(),
});

export type AddDeviceSchemaType = z.infer<typeof AddDeviceSchema>;
