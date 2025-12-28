"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

export function DemoToasts() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Enhanced UI Components Demo</span>
          <Badge variant="secondary">New</Badge>
        </CardTitle>
        <CardDescription>
          Showcase of enhanced UI components with toast notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Button Demo */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Button Variants</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => toast.success("Success action completed!")}
              variant="default"
            >
              Success Toast
            </Button>
            <Button
              onClick={() => toast.error("Something went wrong!")}
              variant="destructive"
            >
              Error Toast
            </Button>
            <Button
              onClick={() => toast.info("Information message")}
              variant="outline"
            >
              Info Toast
            </Button>
            <Button
              onClick={() => toast.warning("Please be careful!")}
              variant="secondary"
            >
              Warning Toast
            </Button>
          </div>
        </div>

        <Separator />

        {/* Alert Demo */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Alert Component</h3>
          <Alert>
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              This is an enhanced alert component with improved styling.
            </AlertDescription>
          </Alert>
        </div>

        <Separator />

        {/* Progress Demo */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Progress Indicator</h3>
          <Progress value={75} className="w-full" />
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Loading...</span>
            <span className="text-sm font-medium">75%</span>
          </div>
          <Button
            onClick={() => toast("Progress completed!", {
              description: "All tasks have been processed successfully.",
            })}
            variant="outline"
            size="sm"
          >
            Complete Progress
          </Button>
        </div>

        <Separator />

        {/* Badge Demo */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Badge Variants</h3>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </div>

        <Separator />

        {/* Advanced Toast Demo */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Advanced Toasts</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => toast.success("Great job!", {
                description: "You've successfully completed all tasks.",
                action: {
                  label: "View Details",
                  onClick: () => toast.info("Details clicked!"),
                },
              })}
              variant="outline"
              size="sm"
            >
              Action Toast
            </Button>
            <Button
              onClick={() => toast.promise(
                new Promise(resolve => setTimeout(resolve, 2000)),
                {
                  loading: "Processing your request...",
                  success: "Operation completed!",
                  error: "Something went wrong!",
                }
              )}
              variant="outline"
              size="sm"
            >
              Promise Toast
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}