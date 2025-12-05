"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { updateUserProfile } from "@/actions/settings/user-settings";

export interface UserData {
    name?: string | null;
    image?: string | null;
}

interface ProfileSectionProps {
    user?: UserData;
}

export function ProfileSection({ user }: ProfileSectionProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [imagePreview, setImagePreview] = useState(user?.image || "");
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

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Profile</h3>
            <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={imagePreview || ""} />
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
    );
}
