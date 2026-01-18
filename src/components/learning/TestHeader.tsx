'use client';

import React from 'react';

import { LessonHeader } from './LessonHeader';

export const TestHeader: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(1);

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      console.log('Back clicked - new step:', currentStep - 1);
    }
  };

  const handleClose = () => {
    console.log('Close clicked');
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
        <p className="mt-4">Current Step: {currentStep}</p>
        <button 
          onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
          className="mt-4 px-4 py-2 bg-primary text-white rounded"
        >
          Next Step
        </button>
      </div>
    </div>
  );
};