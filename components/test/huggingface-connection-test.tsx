'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

interface TestResult {
  success: boolean
  message?: string
  error?: string
  hint?: string
  workingModel?: string
  apiKeyPresent?: boolean
  apiKeyPrefix?: string
  testedModels?: Array<{
    model: string
    status?: number
    success: boolean
    response?: any
    error?: string
  }>
}

export function HuggingFaceConnectionTest() {
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(false)

  const runTest = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/test/huggingface-test')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🤗 Hugging Face Connection Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runTest} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              'Test Hugging Face API'
            )}
          </Button>

          {result && (
            <div className={`p-4 rounded-lg border ${
              result.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {result.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={`font-medium ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.success ? 'Success!' : 'Failed'}
                </span>
              </div>

              {result.message && (
                <p className="text-sm text-green-700 mb-2">{result.message}</p>
              )}

              {result.error && (
                <p className="text-sm text-red-700 mb-2 font-mono">{result.error}</p>
              )}

              {result.hint && (
                <div className="flex items-start gap-2 mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <p className="text-sm text-yellow-800">{result.hint}</p>
                </div>
              )}

              {result.success && (
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">
                      ✅ Working Model: {result.workingModel}
                    </Badge>
                    <Badge variant={result.apiKeyPresent ? 'outline' : 'destructive'}>
                      API Key: {result.apiKeyPresent ? 'Present' : 'Missing'}
                    </Badge>
                  </div>
                  
                  {result.apiKeyPrefix && (
                    <p className="text-muted-foreground">
                      Key prefix: <code className="text-xs">{result.apiKeyPrefix}</code>
                    </p>
                  )}

                  {result.testedModels && result.testedModels.length > 0 && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        View All Tested Models ({result.testedModels.length})
                      </summary>
                      <div className="mt-2 space-y-2">
                        {result.testedModels.map((test, idx) => (
                          <div 
                            key={idx}
                            className={`p-2 rounded text-xs ${
                              test.success 
                                ? 'bg-green-50 border border-green-200' 
                                : 'bg-red-50 border border-red-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <code className="font-mono">{test.model}</code>
                              <Badge variant={test.success ? 'default' : 'destructive'} className="text-xs">
                                {test.success ? '✅ Works' : `❌ ${test.status || 'Failed'}`}
                              </Badge>
                            </div>
                            {test.error && (
                              <p className="text-red-600 mt-1">{test.error}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              )}

              {!result.success && result.status && (
                <p className="text-xs text-muted-foreground mt-2">
                  HTTP Status: {result.status}
                </p>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
            <p className="font-medium">Setup Instructions:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Get a free API key from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener" className="text-blue-600 hover:underline">huggingface.co/settings/tokens</a></li>
              <li>Add to .env.local: <code className="text-xs bg-muted px-1 py-0.5 rounded">HUGGINGFACE_API_KEY=hf_...</code></li>
              <li>Restart your dev server</li>
              <li>Run this test</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
