"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, User, Github } from "lucide-react";
import { UserSettingsTab } from "@/components/settings/modal/user-settings-tab";
import { AppSettingsTab } from "@/components/settings/modal/app-settings-tab";
import { type UserSettings } from "@/actions/settings/user-settings";

export interface UserData {
    name?: string | null;
    image?: string | null;
    settings?: UserSettings | null;
}

export interface SettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: UserData;
    defaultTab?: "user" | "app";
    onTabChange?: (tab: "user" | "app") => void;
}

export function SettingsModal({ open, onOpenChange, user, defaultTab = "user", onTabChange }: SettingsModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[calc(100%-2rem)] w-full md:max-w-2xl md:h-[800px] h-[600px] flex flex-col p-0 overflow-hidden gap-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Settings</DialogTitle>
                </DialogHeader>

                <Tabs value={defaultTab} onValueChange={(val) => onTabChange?.(val as "user" | "app")} className="flex-1 flex flex-col h-full overflow-hidden">
                    <TabsList className="flex flex-row w-full justify-start items-stretch h-auto bg-muted/30 rounded-none border-b gap-1 p-2 shrink-0">
                        <TabsTrigger value="user" className="justify-center gap-2 h-10 px-3 flex-1">
                            <User className="h-4 w-4" />
                            User Settings
                        </TabsTrigger>
                        <TabsTrigger value="app" className="justify-center gap-2 h-10 px-3 flex-1">
                            <Settings className="h-4 w-4" />
                            App Settings
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex-1 p-6 overflow-y-auto">
                        <UserSettingsTab user={user} />
                        <AppSettingsTab settings={user?.settings} />
                        <div className="flex flex-col items-center gap-2 pt-6 border-t mt-6 text-center text-sm text-muted-foreground">
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
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
