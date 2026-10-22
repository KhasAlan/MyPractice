
import { z } from "zod";

export const signinSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required." })
        .email({ message: "Invalid email" }),

    password: z
        .string()
        .min(8, {
            message: "Password must be at least 8 characters long",
        }),
});

export const signupSchema = signinSchema
    .extend({
        name: z
            .string()
            .min(1, { message: "Name is required." }),

        confirmPassword: z
            .string()
            .min(1, {
                message: "Password confirmation is required.",
            }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

export type SigninSchema = z.infer<typeof signinSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;
