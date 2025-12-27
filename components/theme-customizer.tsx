"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Settings } from "lucide-react";
import { useTheme } from "next-themes";

const themes = [
  { name: "Light", value: "light", colors: ["#ffffff", "#f8fafc", "#0f172a"] },
  { name: "Dark", value: "dark", colors: ["#0f172a", "#1e293b", "#ffffff"] },
  { name: "System", value: "system", colors: ["#64748b", "#334155", "#0f172a"] },
];

export function ThemeCustomizer() {
  const [open, setOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className="relative"
      >
        <Palette className="h-4 w-4" />
        <span className="sr-only">Customize theme</span>
        <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
          Pro
        </Badge>
      </Button>

      {/* Customizer Panel */}
      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Theme Customizer</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Select Theme</h3>
                <div className="grid grid-cols-3 gap-3">
                  {themes.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors hover:bg-accent ${
                        theme === t.value ? "border-primary" : ""
                      }`}
                    >
                      <div className="flex gap-1">
                        {t.colors.map((color, i) => (
                          <div
                            key={i}
                            className="h-6 w-6 rounded-full border"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Theme customizer is a premium feature. 
                  <br />
                  Basic theme switching is available in the header.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function ThemeCustomizerTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg"
      size="icon"
      variant="premium"
    >
      <Palette className="h-5 w-5" />
    </Button>
  );
}