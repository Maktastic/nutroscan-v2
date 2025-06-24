'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Code, 
  Copy, 
  Check, 
  ChevronRight,
  Key,
  Zap,
  Shield,
  Book
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

const apiEndpoints = [
  {
    method: 'GET',
    path: '/api/meal-plans',
    description: 'List all meal plans for authenticated user',
    auth: true,
    params: [
      { name: 'status', type: 'string', description: 'Filter by status (active, draft, completed)' },
      { name: 'limit', type: 'number', description: 'Number of results (default: 10)' },
      { name: 'page', type: 'number', description: 'Page number for pagination' }
    ],
    response: `{
  "success": true,
  "mealPlans": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}`
  },
  {
    method: 'POST',
    path: '/api/meal-plans/generate',
    description: 'Generate AI-powered meal plan',
    auth: true,
    body: `{
  "duration": 7,
  "healthCondition": "diabetes-type-2",
  "dietaryPreferences": ["vegetarian"],
  "startDate": "2024-01-15"
}`,
    response: `{
  "success": true,
  "mealPlan": {
    "id": "mp_123",
    "name": "7-Day Diabetes Meal Plan",
    "meals": [...],
    "shoppingList": [...]
  }
}`
  },
  {
    method: 'GET',
    path: '/api/user/health-profile',
    description: 'Get user health profile',
    auth: true,
    response: `{
  "success": true,
  "healthProfile": {
    "primaryHealthCondition": "diabetes-type-2",
    "dietaryPreferences": ["vegetarian"],
    "allergies": ["nuts"],
    "goals": ["weight-loss", "manage-blood-sugar"]
  }
}`
  }
]

export default function ApiDocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [selectedEndpoint, setSelectedEndpoint] = useState(0)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const currentEndpoint = apiEndpoints[selectedEndpoint]

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Developer API
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            API Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Integrate NutroScan Pro's powerful meal planning capabilities into your applications
          </p>
        </motion.div>

        {/* Getting Started */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Started</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Key className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Get API Key</h3>
              <p className="text-sm text-gray-600">
                Generate your API key from the dashboard settings
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Authenticate</h3>
              <p className="text-sm text-gray-600">
                Include your API key in the Authorization header
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Code className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Make Requests</h3>
              <p className="text-sm text-gray-600">
                Start making API calls to our endpoints
              </p>
            </div>
          </div>

          {/* Base URL */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Base URL</p>
            <div className="flex items-center justify-between bg-gray-900 text-white rounded-lg p-3">
              <code className="text-sm">https://api.nutroscanpro.com/v1</code>
              <button
                onClick={() => copyToClipboard('https://api.nutroscanpro.com/v1', 'base-url')}
                className="p-1 hover:bg-gray-800 rounded"
              >
                {copiedCode === 'base-url' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Authentication */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Authentication Header</p>
            <div className="flex items-center justify-between bg-gray-900 text-white rounded-lg p-3">
              <code className="text-sm">Authorization: Bearer YOUR_API_KEY</code>
              <button
                onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY', 'auth')}
                className="p-1 hover:bg-gray-800 rounded"
              >
                {copiedCode === 'auth' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* API Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {/* Endpoints List */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-gray-900 mb-4">Endpoints</h3>
            <div className="space-y-2">
              {apiEndpoints.map((endpoint, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedEndpoint(index)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedEndpoint === index
                      ? 'bg-emerald-50 border border-emerald-200'
                      : 'bg-white border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-xs font-medium ${
                        endpoint.method === 'GET' ? 'text-blue-600' : 'text-green-600'
                      }`}>
                        {endpoint.method}
                      </span>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {endpoint.path}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Endpoint Details */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  currentEndpoint.method === 'GET' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {currentEndpoint.method}
                </span>
                <code className="text-lg font-mono">{currentEndpoint.path}</code>
              </div>
              <p className="text-gray-600">{currentEndpoint.description}</p>
              {currentEndpoint.auth && (
                <p className="text-sm text-amber-600 mt-2 flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Requires authentication
                </p>
              )}
            </div>

            {/* Parameters */}
            {currentEndpoint.params && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Parameters</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="pb-2">Name</th>
                        <th className="pb-2">Type</th>
                        <th className="pb-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentEndpoint.params.map((param, index) => (
                        <tr key={index} className="border-t border-gray-200">
                          <td className="py-2 font-mono">{param.name}</td>
                          <td className="py-2 text-gray-600">{param.type}</td>
                          <td className="py-2 text-gray-600">{param.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Request Body */}
            {currentEndpoint.body && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Request Body</h4>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                    <code>{currentEndpoint.body}</code>
                  </pre>
                  <button
                    onClick={() => copyToClipboard(currentEndpoint.body!, `body-${selectedEndpoint}`)}
                    className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded"
                  >
                    {copiedCode === `body-${selectedEndpoint}` ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Response */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Response</h4>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                  <code>{currentEndpoint.response}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(currentEndpoint.response, `response-${selectedEndpoint}`)}
                  className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded"
                >
                  {copiedCode === `response-${selectedEndpoint}` ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rate Limits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 rounded-xl p-8 mt-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Rate Limits</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-bold text-gray-900">100</p>
              <p className="text-sm text-gray-600">Requests per minute</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">10,000</p>
              <p className="text-sm text-gray-600">Requests per day</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">5 MB</p>
              <p className="text-sm text-gray-600">Max request size</p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
