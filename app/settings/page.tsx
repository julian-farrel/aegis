"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Save,
  Wallet,
  Shield,
  Mail,
  Globe
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePrivy } from "@privy-io/react-auth"

export default function SettingsPage() {
  const { user } = usePrivy()
  const [isLoading, setIsLoading] = useState(false)
  const [currency, setCurrency] = useState("USD")

  const handleSave = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="aegis.png"
                alt="Aegis Logo"
                className="h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-transform hover:scale-105"
              />
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
          >
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your wallet connection and application preferences.
          </p>
        </div>

        <div className="space-y-6">
          {/* Account / Wallet Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Connected Wallet
              </CardTitle>
              <CardDescription>
                Your currently active wallet address used for verification.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex flex-col gap-1">
                  <Label className="text-xs font-semibold uppercase text-primary/80">Address</Label>
                  <span className="font-mono text-sm sm:text-base text-foreground break-all">
                    {user?.wallet?.address || "No wallet connected"}
                  </span>
                </div>
                {/* Active Status Indicator */}
                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}