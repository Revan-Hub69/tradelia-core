"use client"

import * as React from "react"
import { Moon, Sun, Palette, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

const colorPresets = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Yellow", value: "#eab308" },
  { name: "Green", value: "#22c55e" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Indigo", value: "#6366f1" },
]

export function ThemeCustomizer() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [currentColor, setCurrentColor] = React.useState("#3b82f6")

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleThemeModeChange = (newTheme: string) => {
    setTheme(newTheme)
  }

  const handleColorChange = (color: string) => {
    setCurrentColor(color)
    // Apply CSS custom property for theme color
    document.documentElement.style.setProperty('--theme-color', color)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full border border-border/40 bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
        >
          <Palette className="h-4 w-4" />
          <span className="sr-only">Toggle theme customizer</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-80 space-y-6">
        <SheetHeader>
          <SheetTitle>Theme Customizer</SheetTitle>
          <SheetDescription>
            Customize the appearance of your dashboard.
          </SheetDescription>
        </SheetHeader>

        {/* Theme Mode Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Theme Mode</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleThemeModeChange('light')}
              className="justify-start"
            >
              <Sun className="mr-2 h-4 w-4" />
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleThemeModeChange('dark')}
              className="justify-start"
            >
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleThemeModeChange('system')}
              className="justify-start"
            >
              <Monitor className="mr-2 h-4 w-4" />
              System
            </Button>
          </div>
        </div>

        {/* Color Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Accent Color</Label>
          <div className="grid grid-cols-5 gap-2">
            {colorPresets.map((color) => (
              <Button
                key={color.value}
                variant={currentColor === color.value ? 'default' : 'outline'}
                size="icon"
                className="h-8 w-8 rounded-full p-0"
                style={{ backgroundColor: color.value }}
                onClick={() => handleColorChange(color.value)}
              >
                <span className="sr-only">{color.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Color Input */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Custom Color</Label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={currentColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="h-8 w-8 rounded border border-border bg-transparent p-0"
            />
            <div className="flex-1">
              <Badge variant="outline" className="font-mono text-xs">
                {currentColor}
              </Badge>
            </div>
          </div>
        </div>

        {/* Current Theme Preview */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Preview</Label>
          <div
            className="rounded-lg border p-4"
            style={{
              backgroundColor: resolvedTheme === 'dark' ? '#1f2937' : '#f9fafb',
              borderColor: currentColor + '40',
            }}
          >
            <div className="space-y-2">
              <h4 className="font-medium" style={{ color: currentColor }}>
                Sample Card
              </h4>
              <p className="text-sm text-muted-foreground">
                This is how your theme will look with the selected colors.
              </p>
              <Button
                size="sm"
                style={{
                  backgroundColor: currentColor,
                  borderColor: currentColor,
                }}
              >
                Primary Button
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}