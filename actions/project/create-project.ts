"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { Data } from "@/types/canvas-types";
import { Prisma } from "@prisma/client";

export async function createProject(name: string, data: Data, thumbnail?: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const project = await prisma.project.create({
        data: {
            name,
            data: data as unknown as Prisma.InputJsonValue,
            thumbnail,
            ownerId: session.user.id,
        },
    });

    revalidatePath("/projects");
    return project;
}
