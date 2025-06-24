import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface PasswordResetEmailProps {
  name: string
  resetUrl: string
}

export default function PasswordResetEmail({ name, resetUrl }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your NutroScan Pro password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Password Reset Request</Heading>
          
          <Text style={text}>Hi {name},</Text>
          
          <Text style={text}>
            We received a request to reset your password. Click the button below 
            to create a new password:
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={resetUrl}>
              Reset Password
            </Button>
          </Section>

          <Text style={text}>
            This link will expire in 1 hour for security reasons. If you didn't 
            request this password reset, please ignore this email.
          </Text>

          <Text style={footerText}>
            © 2024 NutroScan Pro. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '5px',
  maxWidth: '600px',
}

const header = {
  padding: '32px 32px 0',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
  padding: '0 32px',
}

const subtitle = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
}

const text = {
  color: '#484848',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 32px',
  margin: '0 0 20px',
}

const featuresSection = {
  padding: '20px 32px',
  backgroundColor: '#f9fafb',
  borderRadius: '5px',
  margin: '0 32px 20px',
}

const featuresList = {
  margin: '0',
  padding: '0',
  listStyle: 'none',
}

const buttonContainer = {
  padding: '27px 32px',
}

const button = {
  backgroundColor: '#10b981',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
}

const footer = {
  padding: '32px',
  borderTop: '1px solid #e5e7eb',
  marginTop: '32px',
}

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 8px',
}

const link = {
  color: '#10b981',
  textDecoration: 'underline',
}

