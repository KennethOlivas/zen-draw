import { getProject } from "@/actions/project";
import { DrawingApp } from "@/components/canvas/core/drawing-app";
import { Data } from "@/types/canvas-types";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { type UserData } from "@/components/settings/settings-modal";
import { type UserSettings } from "@/actions/settings/user-settings";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {

  const { projectId } = await params;
  const project = await getProject(projectId);

  if (!project || "error" in project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.name,
    description: `View and edit ${project.name} on Zen Draw.`,
  };
}

export default async function ProjectBoardPage({ params }: PageProps) {
  const { projectId } = await params;
  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  if ("error" in project) {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      redirect("/login");
    }

    notFound();
  }

  let initialData = project.data;
  if (typeof initialData === "string") {
    try {
      initialData = JSON.parse(initialData);
    } catch (e) {
      console.error("Failed to parse project data", e);
    }
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let userData: UserData | undefined;

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        image: true,
        settings: true
      }
    });

    if (user) {
      userData = {
        name: user.name,
        image: user.image,
        settings: user.settings as unknown as UserSettings
      };
    }
  }

  return (
    <DrawingApp
      projectId={project.id}
      initialData={initialData as unknown as Data}
      projectName={project.name}
      isOwner={project.isOwner}
      canEdit={project.canEdit}
      isPublic={project.isPublic}
      publicPermission={project.publicPermission}
      user={userData}
    />
  );
}
