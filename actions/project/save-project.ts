"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { Data } from "@/types/canvas-types";
import { Prisma } from "@prisma/client";

export async function saveProject(id: string, data: Data, thumbnail?: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const project = await prisma.project.findUnique({
        where: { id },
    });

    if (!project) {
        throw new Error("Project not found");
    }

    // Check permissions: Owner or Public Edit
    const isOwner = project.ownerId === session.user.id;
    const canEdit = isOwner || (project.isPublic && project.publicPermission === "EDIT");

    if (!canEdit) {
        throw new Error("Forbidden");
    }

    const updatedProject = await prisma.project.update({
        where: { id },
        data: {
            data: data as unknown as Prisma.InputJsonValue,
            thumbnail: thumbnail || project.thumbnail,
        },
    });

    revalidatePath("/projects");
    revalidatePath(`/board/${id}`);
    return updatedProject;
}
