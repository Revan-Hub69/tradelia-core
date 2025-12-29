import { NextResponse } from 'next/server'

export async function GET() {
  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY
  
  // Check if API key exists
  if (!HF_API_KEY) {
    return NextResponse.json({
      success: false,
      error: 'HUGGINGFACE_API_KEY not found in environment variables',
      hint: 'Add HUGGINGFACE_API_KEY to your .env.local file'
    }, { status: 500 })
  }

  // List of models to test (models with multiple providers)
  const modelsToTest = [
    'meta-llama/Llama-3.2-3B-Instruct:sambanova',
    'meta-llama/Llama-3.2-3B-Instruct:novita',
    'meta-llama/Llama-3.2-3B-Instruct:hyperbolic',
    'Qwen/Qwen2.5-1.5B-Instruct:featherless-ai'
  ]

  const results = []
  let successfulModel = null

  for (const model of modelsToTest) {
    console.log(`\n🧪 Testing model: ${model}`)
    
    try {
      const testPrompt = 'Explain cryptocurrency in simple Italian. Max 50 words.'
      
      const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: testPrompt
            }
          ],
          max_tokens: 100,
          temperature: 0.7,
          stream: false
        })
      })

      const responseText = await response.text()
      
      const result = {
        model,
        status: response.status,
        success: response.ok,
        response: response.ok ? JSON.parse(responseText) : responseText
      }

      results.push(result)

      if (response.ok && !successfulModel) {
        successfulModel = model
        console.log(`✅ ${model} works!`)
      } else {
        console.log(`❌ ${model} failed: ${response.status}`)
      }

    } catch (error) {
      console.error(`Error testing ${model}:`, error)
      results.push({
        model,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  return NextResponse.json({
    success: !!successfulModel,
    message: successfulModel 
      ? `Found working model: ${successfulModel}` 
      : 'No working models found',
    workingModel: successfulModel,
    apiKeyPresent: true,
    apiKeyPrefix: HF_API_KEY.substring(0, 10) + '...',
    testedModels: results,
    hint: successfulModel 
      ? `Use model "${successfulModel}" in your code`
      : 'Try again in a few minutes. Models may be loading.'
  })
}
