"use client"

import { useState } from "react"
import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { ImpactDashboard } from "@/components/dashboard/impact-dashboard"
import { UserDashboard } from "@/components/dashboard/user-dashboard"
import { RestaurantDashboard } from "@/components/dashboard/restaurant-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, User, Store } from "lucide-react"

export default function DashboardPage() {
  const [userRole] = useState<"user" | "restaurant" | "admin">("user") // This would come from auth context

  return (
    <main className="min-h-screen bg-background">
      <GlassmorphismNav />

      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue={userRole === "restaurant" ? "restaurant" : "personal"} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 border border-white/20 mb-8">
              <TabsTrigger
                value="impact"
                className="text-white data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Impact
              </TabsTrigger>
              <TabsTrigger
                value="personal"
                className="text-white data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <User className="w-4 h-4 mr-2" />
                Personal
              </TabsTrigger>
              <TabsTrigger
                value="restaurant"
                className="text-white data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Store className="w-4 h-4 mr-2" />
                Restaurant
              </TabsTrigger>
            </TabsList>

            <TabsContent value="impact">
              <ImpactDashboard />
            </TabsContent>

            <TabsContent value="personal">
              <UserDashboard />
            </TabsContent>

            <TabsContent value="restaurant">
              <RestaurantDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
