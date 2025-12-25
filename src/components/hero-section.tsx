import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
    return (
        <div className="relative isolate overflow-hidden pt-14">
            {/* Background gradients */}
            <div
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                aria-hidden="true"
            >
                <div
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                />
            </div>

            <div className="container mx-auto px-4 py-24 sm:py-32 lg:py-40">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-white/10 hover:ring-white/20 hover:bg-white/5 transition-all cursor-pointer">
                            <span className="flex items-center gap-1">
                                <Sparkles className="h-3 w-3 text-yellow-400" />
                                <span className="font-semibold text-white">New v2.0 is out!</span>
                                <span className="ml-1 text-gray-400">See what's new &rarr;</span>
                            </span>
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                        Build your next idea with <span className="text-indigo-400">speed</span> and <span className="text-purple-400">perfection</span>
                    </h1>

                    <p className="mt-6 text-lg leading-8 text-gray-400 max-w-2xl mx-auto">
                        Experience the future of web development. A premium template powered by Next.js and Shadcn/ui.
                        Beautiful, responsive, and ready for production.
                    </p>

                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Button size="lg" className="h-12 px-8 text-base bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0 shadow-lg shadow-indigo-500/20 transition-all hover:scale-105">
                            Get Started
                        </Button>
                        <Button variant="ghost" size="lg" className="h-12 px-8 text-base group text-white hover:text-white hover:bg-white/10">
                            Live Demo <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Bottom gradient */}
            <div
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                aria-hidden="true"
            >
                <div
                    className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                />
            </div>
        </div>
    )
}
