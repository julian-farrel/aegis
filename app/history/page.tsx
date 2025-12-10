"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Scan } from "lucide-react"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import Link from "next/link"

export default function HistoryPage() {
  const { user, authenticated, ready } = usePrivy()
  const router = useRouter()

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/")
    }
  }, [ready, authenticated, router])

  if (!ready || !authenticated) return null

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
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

      <main className="mx-auto max-w-4xl px-6 py-12 lg:px-12">
        <div className="mb-8">
           <h1 className="text-3xl font-bold tracking-tight text-foreground">Activity</h1>
           <p className="text-muted-foreground">View your recent scan history and verification logs.</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <Scan className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">No Activity Yet</h2>
          <p className="text-muted-foreground mb-6">Start scanning gold bars to see your activity history</p>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
             <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}