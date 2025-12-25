import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Component, Activity, Users, DollarSign } from "lucide-react"

const stats = [
    {
        title: "Total Revenue",
        value: "$45,231.89",
        description: "+20.1% from last month",
        icon: DollarSign,
    },
    {
        title: "Subscriptions",
        value: "+2350",
        description: "+180.1% from last month",
        icon: Users,
    },
    {
        title: "Sales",
        value: "+12,234",
        description: "+19% from last month",
        icon: Component,
    },
    {
        title: "Active Now",
        value: "+573",
        description: "+201 since last hour",
        icon: Activity,
    },
]

export default function DashboardPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="bg-muted/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
    )
}
