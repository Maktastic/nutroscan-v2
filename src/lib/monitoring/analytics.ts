import mixpanel from 'mixpanel-browser'
import { v4 as uuidv4 } from 'uuid'

class Analytics {
  private initialized = false
  private userId: string | null = null

  init() {
    if (this.initialized || !process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
      return
    }

    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
      debug: process.env.NODE_ENV === 'development',
      track_pageview: true,
      persistence: 'localStorage',
    })

    this.initialized = true
  }

  identify(userId: string, traits?: Record<string, any>) {
    if (!this.initialized) return

    this.userId = userId
    mixpanel.identify(userId)
    
    if (traits) {
      mixpanel.people.set(traits)
    }
  }

  track(event: string, properties?: Record<string, any>) {
    if (!this.initialized) return

    mixpanel.track(event, {
      ...properties,
      timestamp: new Date().toISOString(),
    })
  }

  pageView(pageName: string, properties?: Record<string, any>) {
    this.track('Page Viewed', {
      page: pageName,
      ...properties,
    })
  }

  // Specific event methods
  trackSignup(method: 'email' | 'google') {
    this.track('User Signed Up', { method })
  }

  trackMealPlanGenerated(healthCondition: string, duration: number) {
    this.track('Meal Plan Generated', {
      health_condition: healthCondition,
      duration_days: duration,
    })
  }

  trackSubscription(plan: string, action: 'started' | 'upgraded' | 'canceled') {
    this.track('Subscription Changed', {
      plan,
      action,
    })
  }

  trackProgressEntry(metrics: string[]) {
    this.track('Progress Entry Added', {
      metrics_tracked: metrics,
      metrics_count: metrics.length,
    })
  }

  reset() {
    if (!this.initialized) return
    
    mixpanel.reset()
    this.userId = null
  }
}

export const analytics = new Analytics()
