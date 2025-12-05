import { ProfileSection, type UserData } from "./profile-section";
import { SecuritySection } from "./security-section";
import { TabsContent } from "@/components/ui/tabs";

interface UserSettingsTabProps {
    user?: UserData;
}

export function UserSettingsTab({ user }: UserSettingsTabProps) {
    return (
        <TabsContent value="user" className="space-y-6 mt-0">
            <ProfileSection user={user} />
            <SecuritySection />
        </TabsContent>
    );
}
