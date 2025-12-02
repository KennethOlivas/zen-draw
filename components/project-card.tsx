"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MoreVertical, Pencil, Trash2, ExternalLink } from "lucide-react";
import { deleteProject, renameProject } from "@/actions/project";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    thumbnail: string | null;
    updatedAt: Date;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newName, setNewName] = useState(project.name);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRename = async () => {
    await renameProject(project.id, newName);
    setIsRenameOpen(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this project?")) {
      setIsDeleting(true);
      await deleteProject(project.id);
      setIsDeleting(false);
    }
  };

  return (
    <div className="group relative bg-white border-2 border-[#1a1a1a] rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-1">
      <Link href={`/board/${project.id}`} className="block aspect-video bg-gray-100 relative overflow-hidden">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Preview
          </div>
        )}
      </Link>

      <div className="p-4 flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg truncate pr-2" title={project.name}>
            {project.name}
          </h3>
          <p className="text-xs text-gray-500">
            Edited {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsRenameOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Project Name"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
