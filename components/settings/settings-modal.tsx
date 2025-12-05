"use client";

import { useState, useRef, useEffect, useEffectEvent } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ColorPaletteManager } from "@/components/settings/color-palette-manager";
import { updateUserProfile, changePassword, updateAppSettings, type UserSettings } from "@/actions/settings/user-settings";
import { type ColorPalette } from "@/constant/palettes";
import { BACKGROUND_COLORS } from "@/constant/settings";
import { Loader2, Settings, User, Upload } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // User Settings State
    const [name, setName] = useState(user?.name || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [imagePreview, setImagePreview] = useState(user?.image || "");

    // App Settings State
    const [defaultBackgroundColor, setDefaultBackgroundColor] = useState("#ffffff");
    const [colorPalettes, setColorPalettes] = useState<ColorPalette[]>([]);

    const onSetDefaultBackgroundColor = useEffectEvent((color: string) => {
        setDefaultBackgroundColor(color);
    });

    const onSetColorPalettes = useEffectEvent((palettes: ColorPalette[]) => {
        setColorPalettes(palettes);
    });

    useEffect(() => {
        if (user?.settings?.defaultBackgroundColor) {
            onSetDefaultBackgroundColor(user.settings.defaultBackgroundColor);
        }
        if (user?.settings?.colorPalettes) {
            onSetColorPalettes(user.settings.colorPalettes);
        }
    }, [user]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async () => {
        setIsLoading(true);
        let imageUrl = user?.image;
        if (imagePreview && imagePreview !== user?.image) {
            imageUrl = imagePreview;
        }

        const res = await updateUserProfile({ name, image: imageUrl || undefined });
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("Profile updated");
        }
        setIsLoading(false);
    };

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

    const handleUpdateAppSettings = async () => {
        setIsLoading(true);
        const res = await updateAppSettings({
            defaultBackgroundColor,
            colorPalettes
        });
        if (res.error) {
            toast.error(res.error);
        } else {
            toast.success("App settings updated");
            if (typeof window !== "undefined") {
                router.refresh();
            }
        }
        setIsLoading(false);
    };

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
                        <TabsContent value="user" className="space-y-6 mt-0">
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Profile</h3>
                                <div className="flex items-center gap-6">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src={imagePreview} />
                                        <AvatarFallback>{name?.charAt(0) || "U"}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col gap-2">
                                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload new picture
                                        </Button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            JPG or PNG. Max size of 800K
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Display Name</Label>
                                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                                </div>

                                <div className="flex justify-end">
                                    <Button onClick={handleUpdateProfile} disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Save Profile
                                    </Button>
                                </div>
                            </div>

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
                        </TabsContent>

                        <TabsContent value="app" className="space-y-6 mt-0">
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Appearance</h3>
                                <div className="space-y-2">
                                    <Label>Default Canvas Background</Label>
                                    <div className="grid grid-cols-8 gap-2">
                                        {BACKGROUND_COLORS.map((color) => (
                                            <button
                                                key={color}
                                                className={cn(
                                                    "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                                                    defaultBackgroundColor === color ? "border-primary ring-2 ring-primary/30" : "border-border",
                                                )}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setDefaultBackgroundColor(color)}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Choose the default background color for new projects.
                                    </p>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <ColorPaletteManager
                                    palettes={colorPalettes}
                                    onPalettesChange={setColorPalettes}
                                />
                            </div>

                            <div className="border-t pt-6 flex justify-end">
                                <Button onClick={handleUpdateAppSettings} disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Preferences
                                </Button>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
