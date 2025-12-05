"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getProject(id: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const project = await prisma.project.findUnique({
        where: { id },
    });

    if (!project) {
        return null;
    }

    const isOwner = session?.user?.id === project.ownerId;
    const canView = isOwner || project.isPublic;

    if (!canView) {
        return null;
    }

    return {
        ...project,
        isOwner,
        canEdit: isOwner || (project.isPublic && project.publicPermission === "EDIT" && !!session),
    };
}
