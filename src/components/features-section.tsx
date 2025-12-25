import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Layers, Smartphone, Zap, Shield, Globe, MousePointer } from "lucide-react"

const features = [
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "Built on Next.js 14 Server Components for unparalleled performance and speed.",
    },
    {
        icon: Layers,
        title: "Modern Stack",
        description: "Leveraging Tailwind CSS and Shadcn/ui for ease of customization and beauty.",
    },
    {
        icon: Smartphone,
        title: "Fully Responsive",
        description: "Flawless rendering on any device, from mobile phones to large desktop screens.",
    },
    {
        icon: Shield,
        title: "Secure by Default",
        description: "Enterprise-grade security best practices implemented right out of the box.",
    },
    {
        icon: Globe,
        title: "Global Edge",
        description: "Deploy anywhere with confidence using Vercel's global edge network.",
    },
    {
        icon: MousePointer,
        title: "Interactive UI",
        description: "Smooth animations and micro-interactions that delight your users.",
    },
]

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 bg-black/20 relative">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <Badge variant="outline" className="mb-4 border-indigo-500/30 text-indigo-400">Features</Badge>
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
                        Everything you need to build
                    </h2>
                    <p className="text-gray-400 text-lg">
                        A complete toolkit designed to help you ship faster and better.
                        Don't waste time on configuration.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} className="bg-white/5 border-white/10 hover:border-indigo-500/50 hover:bg-white/10 transition-all duration-300 group">
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                                    <feature.icon className="h-6 w-6 text-indigo-400" />
                                </div>
                                <CardTitle className="text-white">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-gray-400">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
