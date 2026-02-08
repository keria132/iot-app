import { z } from 'zod';
import { DeviceType } from '../types/global';

export const AddDeviceSchema = z.object({
  name: z.string().trim().min(1, 'Device name is required'),
  ip: z.ipv4(),
  type: z.enum(DeviceType, 'Invalid device type'),
  room: z.string().optional(),
});

export type AddDeviceSchemaType = z.infer<typeof AddDeviceSchema>;
