'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Target, TrendingUp, Users } from 'lucide-react';

export default function MarketingPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Marketing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Strategic marketing initiatives and campaigns to drive user acquisition and engagement.
        </p>
      </div>

      {/* Marketing KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,345</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">
              +0.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,100</div>
            <p className="text-xs text-muted-foreground">
              New users this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaign ROI</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2x</div>
            <p className="text-xs text-muted-foreground">
              Return on investment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Active Marketing Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Q1 2025 Product Launch</h3>
                <p className="text-sm text-muted-foreground">
                  Multi-channel campaign for new features
                </p>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Social Media Engagement</h3>
                <p className="text-sm text-muted-foreground">
                  Building community across platforms
                </p>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Referral Program</h3>
                <p className="text-sm text-muted-foreground">
                  Incentivizing user referrals
                </p>
              </div>
              <Badge variant="outline">Planned</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Marketing Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Target className="mr-2 h-4 w-4" />
            Create New Campaign
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" />
            View Audience Insights
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <TrendingUp className="mr-2 h-4 w-4" />
            Analyze Performance
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}