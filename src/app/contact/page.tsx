'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageCircle, Building, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast.success('Message sent successfully!')
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      })
      setIsSubmitting(false)
    }, 2000)
  }

  const contactTypes = [
    { value: 'general', label: 'General Inquiry', icon: Mail },
    { value: 'support', label: 'Technical Support', icon: MessageCircle },
    { value: 'enterprise', label: 'Enterprise Sales', icon: Building }
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600">
            We'd love to hear from you. Send us a message and we'll respond within 24 hours.
          </p>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm p-8"
        >
          {/* Contact Type Selection */}
          <div className="mb-8">
            <Label className="text-base mb-4 block">What can we help you with?</Label>
            <div className="grid grid-cols-3 gap-4">
              {contactTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      formData.type === type.value
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2 text-gray-700" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </motion.div>

        {/* Additional Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 grid md:grid-cols-3 gap-8 text-center"
        >
          <div>
            <Mail className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
            <p className="text-gray-600">support@nutroscanpro.com</p>
          </div>
          <div>
            <MessageCircle className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Live Chat</h3>
            <p className="text-gray-600">Available Mon-Fri, 9am-5pm EST</p>
          </div>
          <div>
            <Building className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Office</h3>
            <p className="text-gray-600">San Francisco, CA</p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
