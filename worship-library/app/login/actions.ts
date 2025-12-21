"use server";

import {z} from "zod";
import {createSession, deleteSession} from "@/lib/session";
import {redirect, RedirectType} from "next/navigation";
import {Api} from "@/services/api-client";

const loginSchema = z.object({
    login: z
        .string()
        .trim()
        .min(3, "Login must be at least 3 characters"),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .trim(),
});

export async function login(prevState: any, formData: FormData) {
    const result = loginSchema.safeParse(Object.fromEntries(formData));
    
    console.log(result);
    
    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }
    const { login, password } = result.data;
    
    try {
        const user = await Api.user.getByLogin(login);

        console.log('Found user:', user);

        if (password !== user.password) {
            return {
                errors: {
                    password: ["Invalid login or password"],
                },
            };
        }

        await createSession(user.id);


        return { success: true };

    } catch (error: any) {
        console.error('Login error:', error);

        if (error?.response?.status === 404) {
            return {
                errors: {
                    login: ["Invalid login or password"],
                },
            };
        }

        return {
            errors: {
                login: ["Something went wrong. Please try again."],
            },
        };
    }
}

export async function logout() {
    await deleteSession();
    redirect("/login");
}