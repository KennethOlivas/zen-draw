import Link from "next/link";
import { Project } from "@prisma/client";
import { getProjects } from "@/actions/project";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { Metadata } from "next";
import { SettingsTrigger } from "@/components/projects/settings-trigger";

export const metadata: Metadata = {
  title: "My Projects",
  description: "Manage your Zen Draw projects.",
};

export default async function ProjectsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-background p-8 font-['Virgil']">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">My Projects</h1>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <SettingsTrigger user={session.user as any} />
            <Link href="/board?new=true">
              <Button>
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </Link>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 mb-4">No projects yet.</p>
            <Link href="/board?new=true">
              <Button variant="outline" className="border-2 border-[#1a1a1a]">
                Start Drawing
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {projects.map((project: Project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
