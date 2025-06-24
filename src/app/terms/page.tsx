'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, FileText, Scale, AlertCircle, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function TermsOfServicePage() {
  const sections = [
    {
      icon: FileText,
      title: 'Acceptance of Terms',
      content: `By accessing and using NutroScan Pro, you accept and agree to be bound by the terms 
      and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
      icon: Scale,
      title: 'Use License',
      content: `Permission is granted to temporarily access NutroScan Pro for personal, non-commercial use only. 
      This license shall automatically terminate if you violate any of these restrictions.`
    },
    {
      icon: AlertCircle,
      title: 'Medical Disclaimer',
      content: `NutroScan Pro provides meal planning services for informational purposes only. 
      Always consult with a qualified healthcare provider before making any dietary changes, 
      especially if you have pre-existing health conditions.`
    },
    {
      icon: Shield,
      title: 'Limitation of Liability',
      content: `In no event shall NutroScan Pro or its suppliers be liable for any damages arising 
      out of the use or inability to use the materials on NutroScan Pro's website.`
    }
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </motion.div>

        {/* Content */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <p className="text-gray-700 leading-relaxed">
              Welcome to NutroScan Pro. These terms and conditions outline the rules and regulations 
              for the use of NutroScan Pro's Website and Services. By using this service, we assume 
              you accept these terms and conditions. Do not continue to use NutroScan Pro if you do 
              not agree to take all of the terms and conditions stated on this page.
            </p>
          </motion.div>

          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">{section.title}</h2>
                    <p className="text-gray-700 leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}

          {/* Agreement Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-blue-50 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Questions About Our Terms?</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="space-y-2 text-gray-700">
              <p>Email: legal@nutroscanpro.com</p>
              <p>Phone: 1-800-NUTRO-SCAN</p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
