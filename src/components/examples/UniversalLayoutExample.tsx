'use client';

import React from 'react';

import { UniversalLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const UniversalLayoutExample: React.FC = () => {
  return (
    <UniversalLayout showSidebar={true} showMobileNav={true}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard Universale</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Componenti Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Sidebar, Header, Mobile Nav, Command Palette</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Componenti Premium</CardTitle>
            </CardHeader>
            <CardContent>
              <p>20000+ componenti signature, motion, educational</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sistema Universale</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Layout responsive, accessibile, performante</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </UniversalLayout>
  );
};