"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  TrendingUp, 
  BarChart3, 
  Zap, 
  Brain, 
  Target,
  BookOpen,
  Filter,
  Grid3X3,
  List,
  Star,
  Clock
} from 'lucide-react';

const topicCategories = [
  {
    id: 'all',
    name: 'All Topics',
    icon: Grid3X3,
    color: 'bg-blue-500'
  },
  {
    id: 'trading',
    name: 'Trading Strategies',
    icon: TrendingUp,
    color: 'bg-green-500'
  },
  {
    id: 'analysis',
    name: 'Technical Analysis',
    icon: BarChart3,
    color: 'bg-purple-500'
  },
  {
    id: 'psychology',
    name: 'Market Psychology',
    icon: Brain,
    color: 'bg-pink-500'
  },
  {
    id: 'risk',
    name: 'Risk Management',
    icon: Target,
    color: 'bg-red-500'
  },
  {
    id: 'automation',
    name: 'Algo Trading',
    icon: Zap,
    color: 'bg-yellow-500'
  }
];

const learningPaths = [
  {
    id: 1,
    title: 'Technical Analysis Fundamentals',
    description: 'Learn chart patterns, indicators, and market structure',
    category: 'analysis',
    difficulty: 'Beginner',
    duration: '2-3 hours',
    lessons: 12,
    rating: 4.8,
    image: '📈',
    tags: ['Charts', 'Patterns', 'Indicators']
  },
  {
    id: 2,
    title: 'Algorithmic Trading Mastery',
    description: 'Build and deploy automated trading systems',
    category: 'automation',
    difficulty: 'Advanced',
    duration: '8-10 hours',
    lessons: 25,
    rating: 4.9,
    image: '🤖',
    tags: ['Python', 'APIs', 'Backtesting']
  },
  {
    id: 3,
    title: 'Risk Management Essentials',
    description: 'Protect your capital and maximize returns',
    category: 'risk',
    difficulty: 'Intermediate',
    duration: '3-4 hours',
    lessons: 15,
    rating: 4.7,
    image: '🛡️',
    tags: ['Position Sizing', 'Stop Loss', 'Portfolio']
  },
  {
    id: 4,
    title: 'Market Psychology & Behavior',
    description: 'Understand trader emotions and market sentiment',
    category: 'psychology',
    difficulty: 'Beginner',
    duration: '2-3 hours',
    lessons: 10,
    rating: 4.6,
    image: '🧠',
    tags: ['Emotions', 'Biases', 'Sentiment']
  },
  {
    id: 5,
    title: 'Day Trading Strategies',
    description: 'Intraday trading techniques and setups',
    category: 'trading',
    difficulty: 'Intermediate',
    duration: '4-5 hours',
    lessons: 18,
    rating: 4.8,
    image: '⚡',
    tags: ['Scalping', 'Momentum', 'Reversals']
  },
  {
    id: 6,
    title: 'Options & Derivatives',
    description: 'Advanced trading instruments and strategies',
    category: 'trading',
    difficulty: 'Advanced',
    duration: '6-8 hours',
    lessons: 22,
    rating: 4.7,
    image: '📊',
    tags: ['Options', 'Greeks', 'Strategies']
  }
];

export default function TopicExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');

  const filteredPaths = learningPaths.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         path.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || path.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || path.difficulty.toLowerCase() === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const sortedPaths = [...filteredPaths].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'duration':
        return parseInt(a.duration) - parseInt(b.duration);
      case 'lessons':
        return b.lessons - a.lessons;
      default:
        return b.rating - a.rating; // popular
    }
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = topicCategories.find(cat => cat.id === categoryId);
    return category ? category.icon : BookOpen;
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search topics, strategies, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/50 border-border/50"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="duration">Shortest</SelectItem>
              <SelectItem value="lessons">Most Lessons</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-1">
          {topicCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex flex-col items-center gap-1 p-3 text-xs data-[state=active]:bg-primary/10"
              >
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {sortedPaths.length} learning path{sortedPaths.length !== 1 ? 's' : ''} found
            </p>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Learning Paths Grid/List */}
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {sortedPaths.map((path) => {
              const IconComponent = getCategoryIcon(path.category);
              
              if (viewMode === 'list') {
                return (
                  <Card key={path.id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{path.image}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{path.title}</h3>
                            <Badge className={getDifficultyColor(path.difficulty)}>
                              {path.difficulty}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{path.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {path.duration}
                            </span>
                            <span>{path.lessons} lessons</span>
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {path.rating}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {path.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button>Start Learning</Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              }

              return (
                <Card key={path.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <Badge className={getDifficultyColor(path.difficulty)}>
                          {path.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {path.rating}
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {path.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {path.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {path.duration}
                      </span>
                      <span>{path.lessons} lessons</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {path.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                      Start Learning
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {sortedPaths.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No learning paths found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or browse different categories.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}