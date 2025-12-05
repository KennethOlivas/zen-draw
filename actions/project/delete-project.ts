"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteProject(id: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const project = await prisma.project.findUnique({
        where: { id },
    });

    if (!project || project.ownerId !== session.user.id) {
        throw new Error("Forbidden");
    }

    await prisma.project.delete({
        where: { id },
    });

    revalidatePath("/projects");
}
