"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { SettingsModal, type UserData } from "@/components/settings/settings-modal";

interface SettingsTriggerProps {
    user?: UserData;
}

export function SettingsTrigger({ user }: SettingsTriggerProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
                <Settings className="w-5 h-5" />
                <span className="sr-only">Settings</span>
            </Button>
            <SettingsModal open={open} onOpenChange={setOpen} user={user} />
        </>
    );
}
