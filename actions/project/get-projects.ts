"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getProjects() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return [];
    }

    return prisma.project.findMany({
        where: {
            ownerId: session.user.id,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });
}
