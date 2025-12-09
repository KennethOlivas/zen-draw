"use client";

import { useState, useEffect, useEffectEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Menu,
    X,
    HelpCircle,
    Download,
    FilePlus,
    Upload,
    Save,
    Share2,
    Copy,
    Check,
    Settings,
    Github,
    Pencil,
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { shortcuts } from "@/constant/shortcuts";
import { Separator } from "@/components/ui/separator";
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
import { usePathname } from "next/navigation";
// import { useSession } from "@/lib/auth-client"; // Use this when client auth is ready

interface RightSettingsMenuProps {
    projectId?: string;
    projectName: string;
    isOwner: boolean;
    canEdit: boolean;
    isPublic: boolean;
    publicPermission: string;
    onSave: (name: string, asNew: boolean) => void;
    onShare: (isPublic: boolean, permission: "VIEW" | "EDIT") => void;
    onSaveFile: () => void;
    onLoadFile: () => void;
    onOpenSettings: () => void;
    onRename?: (newName: string) => void;
}

export function RightSettingsMenu({
    projectId,
    projectName,
    isOwner,
    canEdit,
    isPublic: initialIsPublic,
    publicPermission: initialPublicPermission,
    onSave,
    onShare,
    onSaveFile,
    onLoadFile,
    onOpenSettings,
    onRename,
}: RightSettingsMenuProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const [isSaveAsOpen, setIsSaveAsOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState(projectName);
    const [isPublic, setIsPublic] = useState(initialIsPublic);
    const [permission, setPermission] = useState<"VIEW" | "EDIT">(
        initialPublicPermission as "VIEW" | "EDIT"
    );
    const [copied, setCopied] = useState(false);

    // Rename state
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [renameValue, setRenameValue] = useState(projectName);

    const pathname = usePathname();
    const [fullUrl, setFullUrl] = useState("");

    const onSetContentVisible = useEffectEvent((visible: boolean) => {
        setContentVisible(visible);
    });

    const onSetFullUrl = useEffectEvent((url: string) => {
        setFullUrl(url);
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            onSetFullUrl(window.location.origin + pathname);
        }
    }, [pathname]);

    useEffect(() => {
        if (isExpanded) {
            const timer = setTimeout(() => setContentVisible(true), 50);
            return () => clearTimeout(timer);
        } else {
            onSetContentVisible(false);
        }
    }, [isExpanded]);

    const handleSaveAs = () => {
        onSave(newProjectName, true);
        setIsSaveAsOpen(false);
    };

    const handleShareSave = () => {
        onShare(isPublic, permission);
        setIsShareOpen(false);
    };

    const handleRename = () => {
        if (onRename) {
            onRename(renameValue);
        }
        setIsRenameOpen(false);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getAnimationStyle = (delay: number) => ({
        transitionProperty: "opacity, transform",
        transitionDuration: "200ms",
        transitionTimingFunction: "ease-out",
        transitionDelay: isExpanded ? `${delay}ms` : "0ms",
        opacity: isExpanded ? 1 : 0,
        transform: isExpanded ? "translateX(0)" : "translateX(10px)",
    });

    return (
        <TooltipProvider delayDuration={300}>
            <div
                className={cn(
                    "fixed right-4 top-4 bottom-24 md:bottom-4 z-40 flex flex-col pointer-events-none select-none",
                    isExpanded ? "w-52" : "w-auto"
                )}
                style={{
                    transitionProperty: "width",
                    transitionDuration: "300ms",
                    transitionTimingFunction: "ease-out",
                }}
            >
                <div className="bg-card border-2 border-foreground rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] overflow-hidden pointer-events-auto">
                    {/* Panel content */}
                    <div
                        className={cn(
                            "overflow-hidden",
                            isExpanded
                                ? "max-w-[200px] opacity-100 p-4 "
                                : "max-w-0 opacity-0 p-0"
                        )}
                        style={{
                            transitionProperty: "max-width, opacity, padding",
                            transitionDuration: "300ms",
                            transitionTimingFunction: "ease-out",
                        }}
                    >
                        {contentVisible && (
                            <div className="flex flex-col gap-2 w-[168px]">
                                {/* Project Save Options */}
                                {canEdit && (
                                    <>
                                        {isOwner && (
                                            <div style={getAnimationStyle(0)}>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start gap-2 h-9"
                                                    onClick={() => onSave(projectName, false)}
                                                    disabled={!projectId}
                                                >
                                                    <Save className="h-4 w-4" />
                                                    <span className="text-sm">Save</span>
                                                </Button>
                                            </div>
                                        )}

                                        <div style={getAnimationStyle(50)}>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start gap-2 h-9"
                                                onClick={() => setIsSaveAsOpen(true)}
                                            >
                                                <FilePlus className="h-4 w-4" />
                                                <span className="text-sm">Save As New</span>
                                            </Button>
                                        </div>
                                    </>
                                )}

                                {/* Share */}
                                {isOwner && (
                                    <div style={getAnimationStyle(100)}>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start gap-2 h-9"
                                            onClick={() => setIsShareOpen(true)}
                                            disabled={!projectId}
                                        >
                                            <Share2 className="h-4 w-4" />
                                            <span className="text-sm">Share</span>
                                        </Button>
                                    </div>
                                )}

                                {/* Mobile-only Project Title & Edit */}

                                {/* Mobile-only Project Title & Edit */}
                                <div className="md:hidden" style={getAnimationStyle(150)}>
                                    <Button variant="ghost"
                                        onClick={() => {
                                            setRenameValue(projectName);
                                            setIsRenameOpen(true);
                                        }}
                                        className="w-full justify-start gap-2 h-9" title={projectName}>

                                        <Pencil className="h-4 w-4" />
                                        <span>{projectName}</span>
                                    </Button>

                                </div>



                                {canEdit && <Separator style={getAnimationStyle(125)} />}

                                {/* File Operations */}
                                <div style={getAnimationStyle(200)}>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-2 h-9"
                                        onClick={onSaveFile}
                                    >
                                        <Download className="h-4 w-4" />
                                        <span className="text-sm">Save File</span>
                                    </Button>
                                </div>

                                <div style={getAnimationStyle(250)}>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-2 h-9"
                                        onClick={onLoadFile}
                                    >
                                        <Upload className="h-4 w-4" />
                                        <span className="text-sm">Load File</span>
                                    </Button>
                                </div>

                                {/* Settings */}
                                <div style={getAnimationStyle(300)}>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-2 h-9"
                                        onClick={onOpenSettings}
                                    >
                                        <Settings className="h-4 w-4" />
                                        <span className="text-sm">Settings</span>
                                    </Button>
                                </div>

                                <Separator style={getAnimationStyle(325)} />

                                {/* Help */}
                                <div style={getAnimationStyle(350)}>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start gap-2 h-9"
                                            >
                                                <HelpCircle className="h-4 w-4" />
                                                <span className="text-sm">Help</span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-lg">
                                            <DialogHeader>
                                                <DialogTitle>Keyboard Shortcuts</DialogTitle>
                                            </DialogHeader>
                                            <ScrollArea className="max-h-[60vh] pr-4">
                                                <div className="space-y-6">
                                                    {shortcuts.map((section) => (
                                                        <div key={section.category}>
                                                            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                                                                {section.category}
                                                            </h3>
                                                            <div className="space-y-2">
                                                                {section.items.map((item) => (
                                                                    <div
                                                                        key={item.key}
                                                                        className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0"
                                                                    >
                                                                        <span className="text-sm">{item.action}</span>
                                                                        <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border border-border">
                                                                            {item.key}
                                                                        </kbd>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                            <div className="flex flex-col items-center gap-2 pt-4 border-t mt-2 text-center text-sm text-muted-foreground">
                                                <p>© <a href="https://kennetholivas.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Kenneth Olivas</a></p>
                                                <a
                                                    href="https://github.com/KennethOlivas/zen-draw"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                                                >
                                                    <Github className="h-4 w-4" />
                                                    KennethOlivas/zen-draw
                                                </a>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {/* Login for non-editors */}
                                {!canEdit && (
                                    <div style={getAnimationStyle(350)}>
                                        <Link href="/login">
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start gap-2 h-9"
                                            >
                                                <span className="text-sm">Login</span>
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Collapse button - X icon at top right */}
                    <Tooltip>
                        <TooltipTrigger
                            asChild
                            className={cn(isExpanded && "absolute right-0 top-0")}
                        >
                            <Button
                                variant="ghost"
                                size="icon-lg"
                                className={cn(
                                    "rounded-lg shrink-0",
                                    isExpanded && "m-1.5"
                                )}
                                style={{
                                    transitionProperty: "height, width, margin",
                                    transitionDuration: "200ms",
                                    transitionTimingFunction: "ease-out",
                                }}
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                {isExpanded ? (
                                    <X className="h-4 w-4" />
                                ) : (
                                    <Menu className="h-4 w-4" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            {isExpanded ? "Close menu" : "Open settings menu"}
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>

            {/* Save As Dialog */}
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

            {/* Rename Dialog */}
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

            {/* Share Dialog */}
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

            {/* Settings Modal moved to DrawingApp */}

        </TooltipProvider >
    );
}
