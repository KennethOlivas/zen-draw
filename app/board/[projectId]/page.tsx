import { getProject } from "@/actions/project";
import { DrawingApp } from "@/components/canvas/drawing-app";
import { Data } from "@/types/canvas-types";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectBoardPage({ params }: PageProps) {
  const { projectId } = await params;
  const project = await getProject(projectId);

  if (!project) {
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

  return (
    <DrawingApp
      projectId={project.id}
      initialData={initialData as unknown as Data}
      projectName={project.name}
      isOwner={project.isOwner}
      canEdit={project.canEdit}
      isPublic={project.isPublic}
      publicPermission={project.publicPermission}
    />
  );
}
