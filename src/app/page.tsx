
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-16">
        <div className="glass-card max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold gradient-text mb-4">
            NutroScan Pro
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            AI-Powered Meal Planning for Better Health
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/meal-plans">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                Create Meal Plan
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
