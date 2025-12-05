import { PropertySection } from "../shared/property-section";
import { PropertyButton } from "../shared/property-button";
import { SendToBack, ChevronDown, ChevronUp, BringToFront } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface LayeringInputProps {
    onSendToBack: () => void;
    onSendBackward: () => void;
    onBringForward: () => void;
    onBringToFront: () => void;
}

export function LayeringInput({
    onSendToBack,
    onSendBackward,
    onBringForward,
    onBringToFront
}: LayeringInputProps) {
    return (
        <PropertySection label="Layering">
            <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex-1">
                            <PropertyButton onClick={onSendToBack} className="w-full">
                                <SendToBack className="h-4 w-4" />
                            </PropertyButton>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>Send to back</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex-1">
                            <PropertyButton onClick={onSendBackward} className="w-full">
                                <ChevronDown className="h-4 w-4" />
                            </PropertyButton>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>Send backward</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex-1">
                            <PropertyButton onClick={onBringForward} className="w-full">
                                <ChevronUp className="h-4 w-4" />
                            </PropertyButton>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>Bring forward</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex-1">
                            <PropertyButton onClick={onBringToFront} className="w-full">
                                <BringToFront className="h-4 w-4" />
                            </PropertyButton>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>Bring to front</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </PropertySection>
    );
}
