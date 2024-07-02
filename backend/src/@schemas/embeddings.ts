import { z } from "zod";

export const zEmbedding = z.array(z.array(z.number()));

export type IEmbeddingData = z.infer<typeof zEmbedding>;
