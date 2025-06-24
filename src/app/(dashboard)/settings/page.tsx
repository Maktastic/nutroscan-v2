'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard,
  Download,
  HelpCircle,
  ChevronRight,
  Save,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import toast from 'react-hot-toast'

const settingsSections = [
  {
    id: 'profile',
    title: 'Profile Settings',
    description: 'Manage your personal information',
    icon: User,
    href: '/settings/profile'
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Control how we communicate with you',
    icon: Bell,
    href: '/settings/notifications'
  },
  {
    id: 'billing',
    title: 'Billing & Subscription',
    description: 'Manage your subscription and payment methods',
    icon: CreditCard,
    href: '/settings/billing'
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    description: 'Control your data and account security',
    icon: Shield,
    href: '/settings/privacy'
  },
  {
    id: 'data',
    title: 'Data Export',
    description: 'Download your data and meal plans',
    icon: Download,
    href: '/settings/data-export'
  },
  {
    id: 'help',
    title: 'Help & Support',
    description: 'Get help and contact support',
    icon: HelpCircle,
    href: '/settings/help'
  }
]

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-4">
        {settingsSections.map((section, index) => {
          const Icon = section.icon
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={section.href}>
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                        <Icon className="w-6 h-6 text-gray-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{section.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <Link href="/auth/change-password">
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
          </Link>
          <Link href="/settings/delete-account">
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
              Delete Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
