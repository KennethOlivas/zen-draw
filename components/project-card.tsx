"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MoreVertical, Pencil, Trash2, Download, Info } from "lucide-react";
import { deleteProject, renameProject } from "@/actions/project";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow, format } from "date-fns";
import { JsonValue } from "@prisma/client/runtime/client";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    thumbnail: string | null;
    updatedAt: Date;
    createdAt: Date;
    data: JsonValue;
    isPublic: boolean;
    publicPermission: string;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newName, setNewName] = useState(project.name);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRename = async () => {
    await renameProject(project.id, newName);
    setIsRenameOpen(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteProject(project.id);
    setIsDeleting(false);
    setIsDeleteOpen(false);
  };

  const handleDownload = () => {
    let dataToDownload = project.data;
    if (typeof dataToDownload === 'string') {
      try {
        dataToDownload = JSON.parse(dataToDownload);
      } catch (e) {
        console.error("Failed to parse project data for download", e);
      }
    }
    const dataStr = JSON.stringify(dataToDownload, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="group relative bg-accent-foreground border-2 border-[#1a1a1a] rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-1">
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
          <h3 className="font-bold text-lg truncate pr-2 text-secondary" title={project.name}>
            {project.name}
          </h3>
          <p className="text-xs text-secondary">
            Edited {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="icon" className="h-8 w-8 -mr-2">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsRenameOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsDetailsOpen(true)}>
              <Info className="mr-2 h-4 w-4" />
              Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download JSON
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} className="text-red-600 focus:text-red-600">
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

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="font-semibold text-gray-500">Name</div>
              <div className="col-span-2 font-medium">{project.name}</div>
              
              <div className="font-semibold text-gray-500">Created</div>
              <div className="col-span-2">{format(new Date(project.createdAt), "PPP p")}</div>
              
              <div className="font-semibold text-gray-500">Last Updated</div>
              <div className="col-span-2">{format(new Date(project.updatedAt), "PPP p")}</div>
              
              <div className="font-semibold text-gray-500">Visibility</div>
              <div className="col-span-2 capitalize">
                {project.isPublic ? `Public (${project.publicPermission.toLowerCase()})` : "Private"}
              </div>
              
              <div className="font-semibold text-gray-500">ID</div>
              <div className="col-span-2 font-mono text-xs bg-gray-100 p-1 rounded select-all">
                {project.id}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{project.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
