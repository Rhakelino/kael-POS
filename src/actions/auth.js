"use server";

import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";

const SESSION_COOKIE = "kael-session";

export async function loginWithEmailPin(email, pin) {
    try {
        const user = await db.query.users.findFirst({
            where: and(eq(users.email, email), eq(users.pin, pin)),
            columns: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true,
            },
        });

        if (!user) {
            return { success: false, error: "Email atau PIN salah" };
        }

        // Set session cookie with user ID
        const cookieStore = await cookies();
        cookieStore.set(SESSION_COOKIE, user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return { success: true, data: user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get(SESSION_COOKIE);

        if (!sessionCookie?.value) {
            return null;
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, sessionCookie.value),
            columns: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true,
            },
        });

        return user || null;
    } catch {
        return null;
    }
}

export async function logout() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete(SESSION_COOKIE);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function getStaffList() {
    try {
        const result = await db.query.users.findMany({
            columns: {
                id: true,
                name: true,
                email: true,
                role: true,
                pin: true,
                createdAt: true,
            },
        });
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function createStaff(data) {
    try {
        const id = crypto.randomUUID();
        await db.insert(users).values({
            id,
            name: data.name,
            email: data.email,
            role: data.role || "cashier",
            pin: data.pin || null,
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return { success: true, data: { id } };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function updateStaffPin(userId, newPin) {
    try {
        await db
            .update(users)
            .set({
                pin: newPin,
                updatedAt: new Date(),
            })
            .where(eq(users.id, userId));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function updateStaffRole(userId, newRole) {
    try {
        if (newRole !== "admin" && newRole !== "cashier") {
            return { success: false, error: "Invalid role" };
        }

        await db
            .update(users)
            .set({
                role: newRole,
                updatedAt: new Date(),
            })
            .where(eq(users.id, userId));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function deleteStaff(userId) {
    try {
        await db.delete(users).where(eq(users.id, userId));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
