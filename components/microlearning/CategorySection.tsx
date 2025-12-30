'use client'

import { UnifiedCard, CardContent, CardHeader, CardTitle } from "@/components/ui/design-system/unified-card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { LessonCard } from './LessonCard'
import { BrainIcon, WarningIcon, ChartIcon, ShieldIcon, CoinsIcon } from "@/components/icons"
import type { CategoryWithLessons } from '@/lib/types/microlearning'

interface CategorySectionProps {
  category: CategoryWithLessons
  onLessonUpdate: () => void
}

const categoryIcons = {
  brain: BrainIcon,
  warning: WarningIcon,
  chart: ChartIcon,
  shield: ShieldIcon,
  coins: CoinsIcon
}

const categoryColors = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    icon: 'text-blue-600 dark:text-blue-400'
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    border: 'border-orange-200 dark:border-orange-800',
    text: 'text-orange-700 dark:text-orange-300',
    icon: 'text-orange-600 dark:text-orange-400'
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-700 dark:text-green-300',
    icon: 'text-green-600 dark:text-green-400'
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950/20',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-700 dark:text-red-300',
    icon: 'text-red-600 dark:text-red-400'
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    border: 'border-purple-200 dark:border-purple-800',
    text: 'text-purple-700 dark:text-purple-300',
    icon: 'text-purple-600 dark:text-purple-400'
  }
}

export function CategorySection({ category, onLessonUpdate }: CategorySectionProps) {
  const IconComponent = categoryIcons[category.icon as keyof typeof categoryIcons] || BrainIcon
  const colors = categoryColors[category.color as keyof typeof categoryColors] || categoryColors.blue

  return (
    <section className="space-y-6">
      {/* Category Header */}
      <UnifiedCard className={`${colors.bg} ${colors.border}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-white/50 dark:bg-black/20`}>
                <IconComponent className={`w-6 h-6 ${colors.icon}`} />
              </div>
              <div>
                <CardTitle className={`text-xl ${colors.text}`}>
                  {category.name}
                </CardTitle>
                {category.description && (
                  <p className={`text-sm ${colors.text} opacity-80 mt-1`}>
                    {category.description}
                  </p>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <Badge variant="outline" className={`${colors.bg} ${colors.text} ${colors.border}`}>
                {category.completed_count}/{category.total_count}
              </Badge>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className={colors.text}>Progresso Categoria</span>
              <span className={`font-medium ${colors.text}`}>
                {category.progress_percentage}%
              </span>
            </div>
            <Progress 
              value={category.progress_percentage} 
              className="h-2"
            />
          </div>
        </CardHeader>
      </UnifiedCard>

      {/* Lessons Grid */}
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {category.lessons.map((lesson) => (
          <LessonCard 
            key={lesson.id}
            lesson={lesson}
            onUpdate={onLessonUpdate}
          />
        ))}
      </div>

      {/* Empty State */}
      {category.lessons.length === 0 && (
        <UnifiedCard>
          <CardContent className="p-8 text-center">
            <div className="p-3 rounded-lg bg-muted/30 w-fit mx-auto mb-4">
              <IconComponent className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Lezioni in Preparazione</h3>
            <p className="text-muted-foreground">
              Stiamo preparando le lezioni per questa categoria. Torna presto!
            </p>
          </CardContent>
        </UnifiedCard>
      )}
    </section>
  )
}