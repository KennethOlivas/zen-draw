"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle, Github } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { shortcuts } from "@/constant/shortcuts"

export function HelpModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
          <HelpCircle className="h-4 w-4" />
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
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">{section.category}</h3>
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
  )
}
