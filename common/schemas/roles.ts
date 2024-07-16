import z from 'zod'

export const zRole = z.enum(["admin", "user", "coach"]);

export const zChatRole = z.enum(["user", "system", "assistant"]);

export type IRole = z.infer<typeof zRole>;

export type IChatRole = z.infer<typeof zChatRole>;