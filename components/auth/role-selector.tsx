"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Store, Shield } from "lucide-react"

interface RoleSelectorProps {
  onRoleSelect: (role: "user" | "restaurant" | "admin") => void
}

export function RoleSelector({ onRoleSelect }: RoleSelectorProps) {
  const roles = [
    {
      id: "user" as const,
      title: "Individual Donor",
      description: "Donate meals, earn rewards, and track your impact",
      icon: Heart,
      features: ["Donate to restaurants", "Earn scratch cards", "Join leaderboards", "Track impact"],
    },
    {
      id: "restaurant" as const,
      title: "Restaurant Partner",
      description: "Manage your restaurant and receive meal donations",
      icon: Store,
      features: ["Manage menu items", "Receive donations", "Track redemptions", "View analytics"],
    },
    {
      id: "admin" as const,
      title: "Platform Admin",
      description: "Manage the platform and oversee operations",
      icon: Shield,
      features: ["User management", "Restaurant approval", "System analytics", "Content moderation"],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Choose Your Role</h2>
        <p className="text-white/70">Select how you'd like to participate in DishDirect</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card
            key={role.id}
            className="glassmorphism border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
            onClick={() => onRoleSelect(role.id)}
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <role.icon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-white">{role.title}</CardTitle>
              <CardDescription className="text-white/70">{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {role.features.map((feature, index) => (
                  <li key={index} className="text-sm text-white/80 flex items-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground ripple-effect">
                Select {role.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
