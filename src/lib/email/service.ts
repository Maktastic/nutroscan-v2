import { Resend } from 'resend'
import WelcomeEmail from './templates/welcome'
import PasswordResetEmail from './templates/password-reset'
import SubscriptionConfirmationEmail from './templates/subscription-confirmation'
import WeeklyReminderEmail from './templates/weekly-reminder'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'NutroScan Pro <noreply@nutroscanpro.com>',
      to,
      subject: 'Welcome to NutroScan Pro!',
      react: WelcomeEmail({ 
        name, 
        loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/auth/signin` 
      }),
    })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    return { success: false, error }
  }
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`
    
    const { data, error } = await resend.emails.send({
      from: 'NutroScan Pro <noreply@nutroscanpro.com>',
      to,
      subject: 'Reset your password',
      react: PasswordResetEmail({ name, resetUrl }),
    })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    return { success: false, error }
  }
}
