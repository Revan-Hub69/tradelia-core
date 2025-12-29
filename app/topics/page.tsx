import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BrainIcon } from "@/components/icons/brain-icon"
import { MicrostructureIcon } from "@/components/icons/microstructure-icon"
import { EconomicsIcon } from "@/components/icons/economics-icon"

const topicsData = [
  {
    id: "market-structure",
    title: "Market Structure",
    description: "Understanding how financial markets operate, including order flow, liquidity, and market participants.",
    category: "Microstructure",
    icon: "microstructure",
    difficulty: "Intermediate",
    tags: ["order flow", "liquidity", "market making", "price discovery"]
  },
  {
    id: "behavioral-finance",
    title: "Behavioral Finance",
    description: "Exploring psychological factors that influence market decisions and investment outcomes.",
    category: "Psychology",
    icon: "brain",
    difficulty: "Beginner",
    tags: ["cognitive bias", "emotions", "decision making", "market psychology"]
  },
  {
    id: "macro-economics",
    title: "Macro Economics",
    description: "Economic indicators, monetary policy, and their impact on financial markets.",
    category: "Economics",
    icon: "economics",
    difficulty: "Intermediate",
    tags: ["GDP", "inflation", "interest rates", "monetary policy"]
  },
  {
    id: "algorithmic-trading",
    title: "Algorithmic Trading",
    description: "Systematic approaches to trading using mathematical models and computer algorithms.",
    category: "Technology",
    icon: "microstructure",
    difficulty: "Advanced",
    tags: ["algorithms", "backtesting", "execution", "optimization"]
  },
  {
    id: "risk-management",
    title: "Risk Management",
    description: "Techniques for measuring, monitoring, and controlling financial risks.",
    category: "Risk",
    icon: "brain",
    difficulty: "Intermediate",
    tags: ["VaR", "portfolio risk", "hedging", "stress testing"]
  },
  {
    id: "derivatives",
    title: "Derivatives",
    description: "Options, futures, swaps, and other derivative instruments and their applications.",
    category: "Products",
    icon: "microstructure",
    difficulty: "Advanced",
    tags: ["options", "futures", "hedging", "speculation"]
  }
]

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "brain":
      return <BrainIcon className="h-8 w-8" />
    case "economics":
      return <EconomicsIcon className="h-8 w-8" />
    case "microstructure":
    default:
      return <MicrostructureIcon className="h-8 w-8" />
  }
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "beginner":
      return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
    case "intermediate":
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
    case "advanced":
      return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20"
  }
}

export default function TopicsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Topics</h2>
          <p className="text-muted-foreground">
            Explore different aspects of trading and finance through curated topics.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {topicsData.map((topic) => (
          <Card key={topic.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getIcon(topic.icon)}
                  <CardTitle className="text-xl">{topic.title}</CardTitle>
                </div>
                <Badge variant="outline" className={getDifficultyColor(topic.difficulty)}>
                  {topic.difficulty}
                </Badge>
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                {topic.category}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{topic.description}</p>
              
              <div className="flex flex-wrap gap-1">
                {topic.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-muted-foreground">
                  {topic.tags.length} concepts
                </span>
                <Link href={`/topics/${topic.id}`}>
                  <Button variant="outline" size="sm">
                    Explore Topic
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">How to Use Topics</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Each topic contains curated content designed to help you understand specific aspects of trading and finance. 
          Topics are organized by difficulty level and category to help you progress systematically.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-primary/10 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
            </div>
            <h4 className="font-medium">Focused Learning</h4>
            <p className="text-xs text-muted-foreground">Dive deep into specific topics</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-primary/10 flex items-center justify-center">
              <div className="w-4 h-3 border-l-2 border-b-2 border-primary transform rotate-45"></div>
            </div>
            <h4 className="font-medium">Progressive Difficulty</h4>
            <p className="text-xs text-muted-foreground">From beginner to advanced</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-primary/10 flex items-center justify-center">
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-primary"></div>
                <div className="w-1 h-1 rounded-full bg-primary"></div>
                <div className="w-1 h-1 rounded-full bg-primary"></div>
              </div>
            </div>
            <h4 className="font-medium">Connected Concepts</h4>
            <p className="text-xs text-muted-foreground">See how topics relate to each other</p>
          </div>
        </div>
      </div>
    </div>
  )
}