import * as z from "zod";

const modelSchema = z.object({
  model_id: z.string(),
  model_name: z.string(),
});

export const modelApiResponseSchema = z.object({
  message: z.string(),
  models: z.array(modelSchema),
});

export type Model = z.infer<typeof modelSchema>;
