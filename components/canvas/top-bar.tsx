"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface TopBarProps {
  projectId?: string;
  projectName: string;
  isOwner: boolean;
  onRename: (newName: string) => void;
}

export function TopBar({
  projectId,
  projectName,
  isOwner,
  onRename,
}: TopBarProps) {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState(projectName);

  const handleRename = () => {
    onRename(renameValue);
    setIsRenameOpen(false);
  };

  return (
    <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center pointer-events-none">
      <div className="pointer-events-auto flex items-center bg-toolbar-bg backdrop-blur-sm p-2 rounded-xl border shadow-sm">
        <Link href="/projects">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2 px-2">
          <span className="font-bold text-sm">{projectName}</span>
          {isOwner && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setRenameValue(projectName);
                setIsRenameOpen(true);
              }}
            >
              <Pencil className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
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
