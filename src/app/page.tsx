import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />
      <div className="flex flex-col">
        <HeroSection />
        <FeaturesSection />

        {/* Simple Footer */}
        <footer className="py-8 border-t border-white/10 mt-auto bg-black">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2024 NextShad Inc. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
