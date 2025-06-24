'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Shield,
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account, 
      update your profile, or use our services. This includes your name, email address, health information, 
      dietary preferences, and payment information.`
    },
    {
      icon: Lock,
      title: 'How We Protect Your Data',
      content: `We implement industry-standard security measures including encryption, secure servers, 
      and regular security audits. Your health data is protected under HIPAA compliance standards.`
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: `We use your information to provide personalized meal plans, track your progress, 
      process payments, and improve our services. We never sell your personal data to third parties.`
    },
    {
      icon: UserCheck,
      title: 'Your Rights',
      content: `You have the right to access, update, or delete your personal information at any time. 
      You can also opt out of marketing communications and request a copy of your data.`
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
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
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
              At NutroScan Pro, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our service. Please read this privacy 
              policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
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
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">{section.title}</h2>
                    <p className="text-gray-700 leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-emerald-50 rounded-xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Questions About Privacy?</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="space-y-2 text-gray-700">
             <p>Email: privacy@nutroscanpro.com</p>
             <p>Phone: 1-800-NUTRO-SCAN</p>
             <p>Address: 123 Health Street, San Francisco, CA 94105</p>
           </div>
         </motion.div>
       </div>
     </div>
   </main>
 )
}
