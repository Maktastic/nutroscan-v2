
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChefHat, Sparkles, Target, Clock, Users, Star, ArrowRight, Play, CheckCircle, Heart, Brain, Utensils, Award, TrendingUp, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const features = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "AI-Powered Nutrition",
    description: "Advanced algorithms create personalized meal plans based on your unique health profile and preferences."
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Goal-Oriented Planning",
    description: "Whether it's weight loss, muscle gain, or maintaining health, our plans adapt to your fitness goals."
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Time-Efficient Meals",
    description: "Busy schedule? Get meal plans that fit your lifestyle with quick, nutritious recipes."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Family-Friendly Options",
    description: "Create meal plans that work for the whole family, considering everyone's preferences and dietary needs."
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Health Condition Support",
    description: "Specialized meal plans for diabetes, heart disease, PCOS, and other health conditions."
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Smart Recipe Recommendations",
    description: "Get intelligent suggestions based on your taste preferences and nutritional requirements."
  }
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Working Mom",
    content: "NutroScan Pro has transformed how I plan meals for my family. The AI suggestions are spot-on and save me hours every week!",
    rating: 5,
    avatar: "👩‍💼",
    condition: "Family meal planning"
  },
  {
    name: "Mike Chen",
    role: "Fitness Enthusiast",
    content: "Finally, a meal planning app that understands my macro goals. Lost 15 pounds in 2 months while gaining muscle!",
    rating: 5,
    avatar: "💪",
    condition: "Weight loss & muscle gain"
  },
  {
    name: "Emma Davis",
    role: "Diabetes Management",
    content: "The diabetes-friendly meal plans have helped me control my blood sugar better than ever. Life-changing!",
    rating: 5,
    avatar: "👩‍⚕️",
    condition: "Type 2 Diabetes"
  },
  {
    name: "Robert Kim",
    role: "Heart Health",
    content: "After my heart attack, NutroScan Pro helped me adopt a heart-healthy diet that's actually delicious.",
    rating: 5,
    avatar: "❤️",
    condition: "Heart disease"
  }
]

const stats = [
  { value: "50K+", label: "Happy Users", icon: <Users className="w-5 h-5" /> },
  { value: "1M+", label: "Meals Planned", icon: <Utensils className="w-5 h-5" /> },
  { value: "95%", label: "Success Rate", icon: <TrendingUp className="w-5 h-5" /> },
  { value: "4.9★", label: "User Rating", icon: <Star className="w-5 h-5" /> }
]

const healthConditions = [
  { name: "Diabetes", icon: "🩺", color: "bg-blue-100 text-blue-600" },
  { name: "Heart Disease", icon: "❤️", color: "bg-red-100 text-red-600" },
  { name: "PCOS", icon: "🌸", color: "bg-pink-100 text-pink-600" },
  { name: "Hypertension", icon: "📊", color: "bg-purple-100 text-purple-600" },
  { name: "Thyroid", icon: "🦋", color: "bg-teal-100 text-teal-600" },
  { name: "Weight Management", icon: "⚖️", color: "bg-green-100 text-green-600" }
]

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">NutroScan Pro</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <Link href="/signin">
                <Button variant="ghost" className="text-gray-700 hover:text-emerald-600">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">
                  Get Started Free
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                <span>Trusted by 50,000+ users worldwide</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Transform Your Health with{' '}
                <span className="gradient-text">AI-Powered</span>{' '}
                Meal Planning
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Discover personalized nutrition plans that fit your lifestyle, dietary preferences, 
                and health goals. Let our AI nutritionist create the perfect meal plan for you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/signup">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white group shadow-xl">
                    Start Free 7-Day Trial
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="group border-2">
                  <Play className="mr-2 w-4 h-4" />
                  Watch Demo
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="text-emerald-600">{stat.icon}</div>
                      <div className="text-2xl font-bold text-emerald-600">{stat.value}</div>
                    </div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="glass-card animate-float p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">AI Meal Planner</h3>
                    <p className="text-sm text-gray-500">Personalized for you</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700 font-medium">Breakfast: Protein-rich smoothie bowl</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700 font-medium">Lunch: Mediterranean quinoa salad</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <span className="text-sm text-gray-700 font-medium">Dinner: Grilled salmon with vegetables</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Daily Nutrition</span>
                    <span className="text-sm text-emerald-600 font-semibold">Optimized</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-gray-900">1,850</div>
                      <div className="text-xs text-gray-500">Calories</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">45g</div>
                      <div className="text-xs text-gray-500">Protein</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">25g</div>
                      <div className="text-xs text-gray-500">Fiber</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-10 animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full opacity-20"></div>
        </div>
        <div className="absolute bottom-20 left-10 animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20"></div>
        </div>
      </section>

      {/* Health Conditions Section */}
      <section className="py-16 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Specialized Plans for Every Health Condition
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI understands the unique nutritional needs for various health conditions and creates targeted meal plans.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthConditions.map((condition, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${condition.color}`}>
                    {condition.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {condition.name}
                    </h3>
                    <p className="text-sm text-gray-500">Specialized nutrition support</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose NutroScan Pro?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform combines cutting-edge nutrition science with personalized recommendations 
              to help you achieve your health goals faster and more effectively.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className="text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Real Results from Real People
            </h2>
            <p className="text-xl text-gray-600">
              See what our community has to say about their transformation journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic text-sm">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-2xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
                <div className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full inline-block">
                  {testimonial.condition}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started with personalized nutrition in just 3 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Complete Your Health Profile",
                description: "Tell us about your health conditions, dietary preferences, allergies, and goals.",
                icon: <Users className="w-8 h-8" />
              },
              {
                step: "2",
                title: "AI Creates Your Plan",
                description: "Our AI nutritionist analyzes your profile and creates a personalized meal plan.",
                icon: <Brain className="w-8 h-8" />
              },
              {
                step: "3",
                title: "Start Your Journey",
                description: "Follow your customized meal plan and track your progress towards better health.",
                icon: <TrendingUp className="w-8 h-8" />
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center text-white mx-auto">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Health?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already transformed their lives with personalized nutrition. 
              Start your journey today with a free 7-day trial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-50 shadow-xl">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
                Learn More
              </Button>
            </div>
            <div className="text-emerald-100 text-sm">
              ✓ No credit card required • ✓ 7-day free trial • ✓ Cancel anytime
            </div>
          </motion.div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">NutroScan Pro</span>
              </div>
              <p className="text-gray-400 mb-4">
                AI-powered meal planning for a healthier you.
              </p>
              <div className="flex space-x-4">
                <Award className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-gray-400">Trusted by healthcare professionals</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">API</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Mobile App</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 NutroScan Pro. All rights reserved. Made with ❤️ for better health.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
