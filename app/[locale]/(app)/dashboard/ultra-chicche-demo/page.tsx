import React from 'react'
import { SafeButton } from '@/src/shared/ui/SafeButton'
import { SoftConfirmation } from '@/src/shared/ui/SoftConfirmation'
import { FeatureGate } from '@/src/shared/ui/FeatureGate'
import { ToolPreview } from '@/src/shared/ui/ToolPreview'
import { TrustBadges } from '@/src/shared/ui/TrustBadges'
import { useEducationMemory } from '@/src/shared/hooks/useEducationMemory'

// Ultra-Chicche 2026 Demo Page
// Showcase of enterprise-grade UX components

export default function UltraChiccheDemoPage() {
  const educationMemory = useEducationMemory('speculation')

  const handleCriticalAction = async () => {
    // Simulate critical action
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Critical action completed')
  }

  const handleToolAccess = () => {
    console.log('Tool access confirmed')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Ultra-Chicche 2026 Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enterprise-grade UX components for financial applications
          </p>
        </div>

        {/* Trust Badges */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Trust Badges</h2>
          <TrustBadges />
        </div>

        {/* Safe Button Examples */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Safe Buttons</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Critical Action (150ms delay)</h3>
              <SafeButton
                variant="critical"
                onClick={handleCriticalAction}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Portfolio
              </SafeButton>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Destructive Action (180ms delay)</h3>
              <SafeButton
                variant="destructive"
                onClick={handleCriticalAction}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Reset All Settings
              </SafeButton>
            </div>

            <div>
              <h3 className="font-medium mb-2">Standard Action (120ms delay)</h3>
              <SafeButton
                variant="safe"
                onClick={handleCriticalAction}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Execute Trade
              </SafeButton>
            </div>
          </div>
        </div>

        {/* Soft Confirmation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Soft Confirmation</h2>
          <SoftConfirmation
            type="warning"
            message="You're about to use the Advanced Risk Calculator. This is a high-risk tool that requires experience."
            onProceed={handleToolAccess}
          >
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
              <p className="text-yellow-800 dark:text-yellow-200">
                Advanced Risk Calculator requires experience with financial modeling.
              </p>
            </div>
          </SoftConfirmation>
        </div>

        {/* Feature Gates */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Feature Gates</h2>
          <div className="space-y-4">
            <FeatureGate feature="advancedCharts">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                <h3 className="font-medium text-green-800 dark:text-green-200">
                  Advanced Charts Available
                </h3>
                <p className="text-green-600 dark:text-green-300">
                  This feature is enabled for your account.
                </p>
              </div>
            </FeatureGate>

            <FeatureGate feature="aiFeatures">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                <h3 className="font-medium text-blue-800 dark:text-blue-200">
                  AI Features (Beta)
                </h3>
                <p className="text-blue-600 dark:text-blue-300">
                  AI-powered analysis and recommendations.
                </p>
              </div>
            </FeatureGate>
          </div>
        </div>

        {/* Tool Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tool Preview</h2>
          <ToolPreview
            toolId="quantum-analyzer"
            title="Quantum Portfolio Analyzer"
            description="Advanced quantum computing-based portfolio optimization"
            complexity="advanced"
            expectedFeatures={[
              "Quantum risk modeling",
              "Multi-dimensional optimization",
              "Real-time market correlation analysis"
            ]}
            estimatedLaunch="Q2 2026"
          />
        </div>

        {/* Education Memory Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Education Memory</h2>
          <div className="space-y-2">
            <p><strong>Journey:</strong> Speculation</p>
            <p><strong>Has Read Errors:</strong> {educationMemory.hasReadErrors ? 'Yes' : 'No'}</p>
            <p><strong>Has Seen Intro:</strong> {educationMemory.hasSeenIntro ? 'Yes' : 'No'}</p>
            <p><strong>Education Level:</strong> {educationMemory.educationLevel}</p>
            
            <div className="mt-4 space-x-2">
              <button
                onClick={() => educationMemory.markIntroSeen()}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm"
              >
                Mark Intro Seen
              </button>
              <button
                onClick={() => educationMemory.markErrorsRead()}
                className="px-3 py-1 bg-orange-100 text-orange-800 rounded text-sm"
              >
                Mark Errors Read
              </button>
              <button
                onClick={() => educationMemory.markEducationalRead()}
                className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm"
              >
                Mark Educational Read
              </button>
            </div>
          </div>
        </div>

        {/* Implementation Notes */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
          <h2 className="text-xl font-semibold mb-4 text-yellow-800 dark:text-yellow-200">
            Implementation Notes
          </h2>
          <ul className="space-y-2 text-yellow-700 dark:text-yellow-300">
            <li>• SafeButton prevents accidental clicks with configurable delays</li>
            <li>• SoftConfirmation provides non-modal inline confirmations</li>
            <li>• FeatureGate enables/disables features based on remote flags</li>
            <li>• ToolPreview shows upcoming features gracefully</li>
            <li>• TrustBadges build user confidence with security indicators</li>
            <li>• useEducationMemory tracks user learning progress intelligently</li>
          </ul>
        </div>
      </div>
    </div>
  )
}