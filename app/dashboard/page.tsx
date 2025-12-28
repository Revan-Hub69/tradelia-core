import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BrainIcon } from "@/components/icons/brain-icon"
import { EconomicsIcon } from "@/components/icons/economics-icon"
import { MicrostructureIcon } from "@/components/icons/microstructure-icon"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">Welcome</Badge>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-muted p-2">
              <BrainIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-medium">AI Insights</h3>
              <p className="text-xs text-muted-foreground">AI-powered market analysis</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-muted p-2">
              <EconomicsIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Economics</h3>
              <p className="text-xs text-muted-foreground">Economic indicators & analysis</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-muted p-2">
              <MicrostructureIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Market Microstructure</h3>
              <p className="text-xs text-muted-foreground">Order flow & liquidity analysis</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}