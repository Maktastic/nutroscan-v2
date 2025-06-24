import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface WelcomeEmailProps {
  name: string
  loginUrl: string
}

export default function WelcomeEmail({ name, loginUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to NutroScan Pro - Your AI-Powered Nutrition Journey Starts Here</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src="https://nutroscanpro.com/logo.png"
              width="120"
              height="40"
              alt="NutroScan Pro"
            />
          </Section>

          <Heading style={h1}>Welcome to NutroScan Pro, {name}!</Heading>
          
          <Text style={text}>
            We're thrilled to have you join our community of health-conscious individuals 
            transforming their lives through personalized nutrition.
          </Text>

          <Section style={featuresSection}>
            <Text style={subtitle}>Here's what you can do with NutroScan Pro:</Text>
            <ul style={featuresList}>
              <li>🤖 Get AI-powered meal plans tailored to your health conditions</li>
              <li>📊 Track your progress with detailed analytics</li>
              <li>🛒 Generate smart shopping lists</li>
              <li>👨‍⚕️ Access nutritionist-approved recipes</li>
              <li>📱 Use our mobile app on the go</li>
            </ul>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href={loginUrl}>
              Get Started
            </Button>
          </Section>

          <Text style={text}>
            Your 14-day free trial has begun! Explore all our features and discover 
            how NutroScan Pro can help you achieve your health goals.
          </Text>

          <Section style={footer}>
            <Text style={footerText}>
              Need help? Reply to this email or visit our{' '}
              <Link href="https://nutroscanpro.com/help" style={link}>
                Help Center
              </Link>
            </Text>
            <Text style={footerText}>
              © 2024 NutroScan Pro. All rights reserved.
            </Text>
          </Section>
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
