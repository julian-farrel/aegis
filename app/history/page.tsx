"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Scan } from "lucide-react"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"

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
    <div className="min-h-screen bg-background">
      <header className="border-border bg-card border-b">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-12">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Activity History</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12 lg:px-12">
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <Scan className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">No Activity Yet</h2>
          <p className="text-muted-foreground mb-6">Start scanning gold bars to see your activity history</p>
          <Button onClick={() => router.push("/dashboard")} className="bg-primary text-primary-foreground">
            Go to Dashboard
          </Button>
        </div>
      </main>
    </div>
  )
}