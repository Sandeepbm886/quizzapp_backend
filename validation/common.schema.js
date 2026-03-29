import { z } from "zod";

export const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Invalid id");

export const requiredStringSchema = z
  .string()
  .trim()
  .min(1, "This field is required");

export const positiveIntSchema = z
  .number()
  .int("Must be an integer")
  .positive("Must be greater than 0");

export const userHeaderSchema = z.object({
  userid: requiredStringSchema,
});

export const userRoleHeaderSchema = userHeaderSchema.extend({
  userrole: z.enum(["teacher", "student"]),
});
