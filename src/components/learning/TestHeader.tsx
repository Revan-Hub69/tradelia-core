'use client';

import React from 'react';

import { LessonHeader } from './LessonHeader';

export const TestHeader: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(1);

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Code Quality P0: Removed console.log for production
    }
  };

  const handleClose = () => {
    // Code Quality P0: Removed console.log for production
    // In a real app, this would navigate away
  };

  return (
    <div className="min-h-screen bg-background">
      <LessonHeader
        currentStep={currentStep}
        totalSteps={5}
        onBack={currentStep > 0 ? handleBack : undefined}
        onClose={handleClose}
        showLogo
        showTrustSignals
      />
      <div className="p-8">
        <h1 className="text-2xl font-bold">Test Content</h1>
        <p>Se vedi questo, l'header dovrebbe essere visibile sopra.</p>
        <p className="mt-4">
          Current Step:
          {currentStep}
        </p>
        <button
          onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
          className="mt-4 rounded bg-primary px-4 py-2 text-white"
        >
          Next Step
        </button>
      </div>
    </div>
  );
};
