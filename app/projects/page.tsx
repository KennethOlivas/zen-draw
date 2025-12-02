import Link from "next/link";
import { getProjects } from "@/actions/project";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-[#fdfdfd] p-8 font-['Virgil']">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#1a1a1a]">My Projects</h1>
          <Link href="/board?new=true">
            <Button className="bg-[#1a1a1a] text-white hover:bg-[#333] gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </Link>
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
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
