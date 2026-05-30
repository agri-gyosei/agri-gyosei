import { Navigation } from "@/components/story/navigation"
import { HeroSection } from "@/components/story/hero-section"
import { FeaturedNovel } from "@/components/story/featured-novel"
import { PhilosophySection } from "@/components/story/philosophy-section"
import { AuthorSection } from "@/components/story/author-section"
import { Footer } from "@/components/story/footer"

export default function StoryPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturedNovel />
      <PhilosophySection />
      <AuthorSection />
      <Footer />
    </main>
  )
}
