import { z } from 'zod';

export const AddRoomSchema = z.object({
  name: z.string().trim().min(1, 'Room name is required'),
  uuid: z.string().trim().min(1, 'The uuid was not provided'),
});

export type AddRoomSchemaType = z.infer<typeof AddRoomSchema>;
