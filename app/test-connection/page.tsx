"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestConnectionPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testConnection = async () => {
    setIsLoading(true)
    setResult(null)
    
    try {
      const response = await fetch('/api/test-connection')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to test connection',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">🧪 Test Supabase Connection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testConnection} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Testing...' : 'Test Connection'}
            </Button>
            
            {result && (
              <div className={`p-4 rounded-lg ${
                result.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <h3 className={`font-semibold ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.success ? '✅ Success' : '❌ Failed'}
                </h3>
                <p className={`mt-2 ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.message}
                </p>
                {result.error && (
                  <p className="text-red-600 text-sm mt-2">
                    Error: {result.error}
                  </p>
                )}
                {result.timestamp && (
                  <p className="text-gray-600 text-sm mt-2">
                    Tested at: {new Date(result.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            )}
            
            <div className="text-sm text-gray-600 mt-4">
              <p>This page tests:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Environment variables configuration</li>
                <li>Supabase client connection</li>
                <li>Database table accessibility</li>
                <li>API route functionality</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 