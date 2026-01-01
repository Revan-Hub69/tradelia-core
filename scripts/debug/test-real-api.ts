#!/usr/bin/env tsx

// Test real API endpoints to see what's actually happening

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testAPIs() {
  const baseUrl = 'https://tradelia.org';
  
  const endpoints = [
    '/api/regime/current',
    '/api/universe/active', 
    '/api/msf/current',
    '/api/health'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n🔍 Testing ${endpoint}...`);
      
      const response = await fetch(`${baseUrl}${endpoint}`);
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Success:`, JSON.stringify(data, null, 2).substring(0, 200) + '...');
      } else {
        const text = await response.text();
        console.log(`❌ Error:`, text.substring(0, 200));
      }
      
    } catch (error) {
      console.log(`💥 Failed:`, error instanceof Error ? error.message : String(error));
    }
  }
}

testAPIs().catch(console.error);