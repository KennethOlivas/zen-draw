"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { Data } from "@/types/canvas-types";



export async function createProject(name: string, data: Data, thumbnail?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const jsonData = JSON.stringify(data);

  const project = await prisma.project.create({
    data: {
      name,
      data: jsonData,
      thumbnail,
      ownerId: session.user.id,
    },
  });

  revalidatePath("/projects");
  return project;
}

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

  const jsonData = JSON.stringify(data);

  const updatedProject = await prisma.project.update({
    where: { id },
    data: {
      data: jsonData,
      thumbnail: thumbnail || project.thumbnail,
    },
  });

  revalidatePath("/projects");
  revalidatePath(`/board/${id}`);
  return updatedProject;
}

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

export async function renameProject(id: string, name: string) {
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

  await prisma.project.update({
    where: { id },
    data: { name },
  });

  revalidatePath("/projects");
}

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

export async function updateProjectShare(id: string, isPublic: boolean, publicPermission: "VIEW" | "EDIT") {
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

  await prisma.project.update({
    where: { id },
    data: {
      isPublic,
      publicPermission,
    },
  });

  revalidatePath(`/board/${id}`);
}
