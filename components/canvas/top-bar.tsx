"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TopBarProps {
  projectName: string;
  isOwner: boolean;
  canEdit: boolean;
  isPublic: boolean;
  publicPermission: string;
  onSave: (name: string, asNew: boolean) => void;
  onShare: (isPublic: boolean, permission: "VIEW" | "EDIT") => void;
}

export function TopBar({
  projectName,
  isOwner,
  canEdit,
  isPublic: initialIsPublic,
  publicPermission: initialPublicPermission,
  onSave,
  onShare,
}: TopBarProps) {
  const [isSaveAsOpen, setIsSaveAsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState(projectName);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [permission, setPermission] = useState<"VIEW" | "EDIT">(
    initialPublicPermission as "VIEW" | "EDIT"
  );
  const [copied, setCopied] = useState(false);

  const handleSaveAs = () => {
    onSave(newProjectName, true);
    setIsSaveAsOpen(false);
  };

  const handleShareSave = () => {
    onShare(isPublic, permission);
    setIsShareOpen(false);
  };

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute top-4 left-4 right-4 z-50 flex justify-between items-center pointer-events-none">
      <div className="pointer-events-auto flex items-center bg-toolbar-bg backdrop-blur-sm p-2 rounded-xl border  shadow-sm">
        <Link href="/projects">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <span className="font-bold text-sm px-2">{projectName}</span>
      </div>

      <div className="pointer-events-auto flex items-center gap-2 bg-toolbar-bg backdrop-blur-sm p-2 rounded-xl border shadow-sm">
        {canEdit && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isOwner && (
                <DropdownMenuItem onClick={() => onSave(projectName, false)}>
                  Save
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setIsSaveAsOpen(true)}>
                Save as New
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {isOwner && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsShareOpen(true)}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        )}
      </div>

      <Dialog open={isSaveAsOpen} onOpenChange={setIsSaveAsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as New Project</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveAsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAs}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Project</DialogTitle>
            <DialogDescription>
              Manage who can see and edit this project.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Public Access</Label>
                <div className="text-sm text-muted-foreground">
                  Anyone with the link can access
                </div>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>

            {isPublic && (
              <div className="space-y-2">
                <Label>Permission</Label>
                <Select
                  value={permission}
                  onValueChange={(v) => setPermission(v as "VIEW" | "EDIT")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIEW">Can View</SelectItem>
                    <SelectItem value="EDIT">Can Edit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Input readOnly value={typeof window !== "undefined" ? window.location.href : ""} />
              <Button size="icon" variant="outline" onClick={copyLink}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleShareSave}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
