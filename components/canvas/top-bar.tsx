"use client";

import { useEffect, useEffectEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Share2, Copy, Check, Pencil } from "lucide-react";
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
import { QRCode } from "@/components/kibo-ui/qr-code";
import { usePathname } from "next/dist/client/components/navigation";

interface TopBarProps {
  projectId?: string;
  projectName: string;
  isOwner: boolean;
  canEdit: boolean;
  isPublic: boolean;
  publicPermission: string;
  onSave: (name: string, asNew: boolean) => void;
  onShare: (isPublic: boolean, permission: "VIEW" | "EDIT") => void;
  onRename: (newName: string) => void;
}

export function TopBar({
  projectId,
  projectName,
  isOwner,
  canEdit,
  isPublic: initialIsPublic,
  publicPermission: initialPublicPermission,
  onSave,
  onShare,
  onRename,
}: TopBarProps) {
  const [isSaveAsOpen, setIsSaveAsOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState(projectName);
  const [renameValue, setRenameValue] = useState(projectName);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [permission, setPermission] = useState<"VIEW" | "EDIT">(
    initialPublicPermission as "VIEW" | "EDIT"
  );
  const [copied, setCopied] = useState(false);

  const pathname = usePathname();

  const [fullUrl, setFullUrl] = useState("");

  const onSetFullUrl = useEffectEvent(() => {
    if (typeof window !== "undefined") {
      setFullUrl(window.location.origin + pathname);
    }
  });

  useEffect(() => {
    onSetFullUrl();
  }, [pathname]);

  const handleSaveAs = () => {
    onSave(newProjectName, true);
    setIsSaveAsOpen(false);
  };

  const handleShareSave = () => {
    onShare(isPublic, permission);
    setIsShareOpen(false);
  };

  const handleRename = () => {
    onRename(renameValue);
    setIsRenameOpen(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(fullUrl);
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
            disabled={!projectId}
            title={!projectId ? "Save project to share" : "Share project"}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        )}

        {!canEdit && (
          <Link href="/login">
            <Button size="sm" variant="outline">
              Login
            </Button>
          </Link>
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

            <div className="flex justify-center p-4 bg-white rounded-lg border">
              <QRCode data={fullUrl} className="w-48 h-48" />
            </div>

            <div className="flex items-center gap-2">
              <Input readOnly value={fullUrl} />
              <Button size="icon" variant="outline" onClick={copyLink}>
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleShareSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
