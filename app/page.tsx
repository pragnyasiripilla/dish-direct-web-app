import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { HeroSection } from "@/components/hero-section"
import { ImpactStats } from "@/components/impact-stats"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <GlassmorphismNav />
      <HeroSection />
      <ImpactStats />
    </main>
  )
}
