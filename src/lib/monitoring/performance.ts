export class PerformanceMonitor {
  private marks: Map<string, number> = new Map()

  mark(name: string) {
    this.marks.set(name, performance.now())
  }

  measure(name: string, startMark: string) {
    const start = this.marks.get(startMark)
    if (!start) {
      console.warn(`Start mark ${startMark} not found`)
      return
    }

    const duration = performance.now() - start
    
    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name,
        value: Math.round(duration),
      })
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`)
    }

    return duration
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    
    try {
      const result = await fn()
      const duration = performance.now() - start
      
      this.logMeasurement(name, duration)
      
      return result
    } catch (error) {
      const duration = performance.now() - start
      this.logMeasurement(name, duration, true)
      throw error
    }
  }

  private logMeasurement(name: string, duration: number, error = false) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name,
        value: Math.round(duration),
        error,
      })
    }
  }
}

export const performance = new PerformanceMonitor()
