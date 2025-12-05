"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { changePassword } from "@/actions/settings/user-settings";
import { toast } from "sonner";

export function SecuritySection() {
    const [isLoading, setIsLoading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handleChangePassword = async () => {
        setIsLoading(true);
        const res = await changePassword(currentPassword, newPassword);
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Password changed");
            setCurrentPassword("");
            setNewPassword("");
            setIsChangingPassword(false);
        }
        setIsLoading(false);
    };

    return (
        <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-medium">Security</h3>
            {!isChangingPassword ? (
                <Button onClick={() => setIsChangingPassword(true)} variant="outline">
                    Change Password
                </Button>
            ) : (
                <div className="grid gap-4 border p-4 rounded-lg bg-muted/10">
                    <div className="space-y-2">
                        <Label>Current Password</Label>
                        <Input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>New Password</Label>
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setIsChangingPassword(false);
                                setCurrentPassword("");
                                setNewPassword("");
                            }}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleChangePassword}
                            variant="destructive"
                            disabled={!currentPassword || !newPassword || isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Password
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
