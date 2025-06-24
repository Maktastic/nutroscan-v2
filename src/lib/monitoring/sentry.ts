import * as Sentry from '@sentry/nextjs'

export function initSentry() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      debug: process.env.NODE_ENV === 'development',
      replaysOnErrorSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      integrations: [
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      beforeSend(event, hint) {
        // Filter out certain errors
        if (event.exception && event.exception.values?.[0]) {
          const error = event.exception.values[0]
          
          // Don't send network errors in development
          if (
            process.env.NODE_ENV === 'development' &&
            error.type === 'NetworkError'
          ) {
            return null
          }
        }
        
        return event
      },
    })
  }
}

export function captureException(error: Error, context?: Record<string, any>) {
  console.error('Error captured:', error, context)
  
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    })
  }
}

export function captureMessage(message: string, level: Sentry.Severity = 'info') {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureMessage(message, level)
  }
}
