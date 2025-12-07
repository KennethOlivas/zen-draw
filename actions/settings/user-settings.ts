"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { type ColorPalette } from "@/constant/palettes";

export interface UserSettings {
    language?: string;
    theme?: string;
    defaultBackgroundColor?: string;
    colorPalettes?: ColorPalette[];
    disableDefaultColors?: boolean;
    gridSize?: number;
    snapThreshold?: number;
}

export async function updateUserProfile(data: { name?: string; image?: string }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.image && { image: data.image }),
            },
        });
        revalidatePath("/");
        return { success: true };
    } catch {
        return { error: "Failed to update profile" };
    }
}

export async function updateAppSettings(settings: UserSettings) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    try {
        // Fetch fresh user data to ensure we have the latest settings
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { settings: true }
        });

        // Merge existing settings with new settings
        const currentSettings = (user?.settings as any) || {};
        const newSettings = { ...currentSettings, ...settings };

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                settings: newSettings as any,
            },
        });
        revalidatePath("/");
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: e instanceof Error ? e.message : "Failed to update settings" };
    }
}

export async function changePassword(password: string, newPassword: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    try {
        await auth.api.changePassword({
            body: {
                currentPassword: password,
                newPassword: newPassword,
                revokeOtherSessions: true
            },
            headers: await headers()
        })
        return { success: true };
    } catch (e) {
        return { error: e instanceof Error ? e.message : "Failed to change password" };
    }
}
