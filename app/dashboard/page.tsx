"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Scan,
  CheckCircle2,
  XCircle,
  Shield,
  LogOut,
  Home,
  FileText,
  Settings,
  Smartphone,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  History,
  X,
  Wallet,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"

export default function Dashboard() {
  const { user, authenticated, ready, logout } = usePrivy()
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<{
    status: "success" | "error" | "warning"
    message: string
    details?: any
  } | null>(null)
  const router = useRouter()
  const [showOwnershipHistory, setShowOwnershipHistory] = useState(false)

  // Redirect to Home if NOT logged in
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/")
    }
  }, [ready, authenticated, router])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const handleNFCScan = async () => {
    setIsScanning(true)
    setScanResult(null)

    setTimeout(async () => {
      try {
        const simulatedSerialNumbers = ["LA000001", "AG000001", "AG000002", "UB000001", "FAKE123", "AG000003"]
        const scannedSerial = simulatedSerialNumbers[Math.floor(Math.random() * simulatedSerialNumbers.length)]

        console.log("[Demo] Scanned serial number:", scannedSerial)

        if (scannedSerial === "FAKE123") {
           setScanResult({
            status: "error",
            message: "Invalid Serial Number",
            details: {
              serialNumber: scannedSerial,
              reason: "This serial number is not registered (DEMO)",
              recommendation: "Please verify with the distributor",
            },
          })
          setIsScanning(false)
          return
        }

        const isTampered = Math.random() > 0.7
        const ownershipHistory = [
          {
            wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
            date: "2024-11-10 14:23:45",
            action: "Transfer",
          },
        ]

        setScanResult({
          status: isTampered ? "warning" : "success",
          message: isTampered ? "Warning: Packaging Opened" : "Gold bar authenticated!",
          details: {
            image: "aegis gold.jpeg",
            serialNumber: scannedSerial,
            weight: "10",
            purity: "99.99",
            company: "Antam",
            verifiedOn: new Date().toLocaleString(),
            currentOwner: user?.wallet?.address || "0xDemoWallet...",
            status: isTampered ? "PACKAGING OPENED" : "SEALED",
            hash: "0x123...abc",
            ownershipHistory: ownershipHistory,
          },
        })

      } catch (error) {
        console.error("Error:", error)
        setScanResult({
          status: "error",
          message: "Scan Error",
          details: { reason: "Demo error occurred" },
        })
      } finally {
        setIsScanning(false)
      }
    }, 2000)
  }

  // If loading or not authenticated, show nothing (or loading spinner)
  if (!ready || !authenticated) return null

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Header - Fixed & Compact */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* Added gold drop-shadow for visibility */}
              <img 
                src="aegis.png" 
                alt="Aegis Logo" 
                className="h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-transform hover:scale-105" 
              />
            </div>
          </div>

          {/* Right Section: Wallet & Logout */}
          <div className="flex items-center gap-4">
            {/* Wallet Address Highlight */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 shadow-[0_0_15px_-5px_var(--primary)] transition-colors hover:bg-primary/15">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]" />
              <span className="font-mono text-xs font-medium text-primary">
                {user?.wallet?.address || user?.email?.address}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-12">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back!
          </h1>
          <p className="text-muted-foreground">
            Ready to verify your assets? Tap below to start.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Scan Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/30 group">
              {/* Background gradient effect */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl transition-all group-hover:bg-primary/10" />
              
              <div className="relative text-center">
                <div className="mb-6 flex justify-center">
                  <div className="rounded-full bg-gradient-to-br from-primary/20 to-transparent p-6 ring-1 ring-primary/30">
                    <Smartphone className="h-12 w-12 text-primary drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-card-foreground mb-3">NFC Gold Verification</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Hold your device near the gold bar packaging to instantly verify its authenticity on the blockchain.
                </p>

                <Button
                  size="lg"
                  onClick={handleNFCScan}
                  disabled={isScanning}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] w-full max-w-sm h-14 text-lg gap-3 shadow-[0_0_20px_-5px_var(--primary)] transition-all"
                >
                  <Scan className={`h-6 w-6 ${isScanning ? "animate-pulse" : ""}`} />
                  {isScanning ? "Scanning..." : "Start NFC Scan"}
                </Button>

                {scanResult && (
                  <div className={`mt-8 rounded-xl border p-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                      scanResult.status === "success" ? "border-green-500/30 bg-green-500/5" : 
                      scanResult.status === "warning" ? "border-yellow-500/30 bg-yellow-500/5" : 
                      "border-red-500/30 bg-red-500/5"
                    }`}>
                    <div className="flex items-start gap-4 mb-6">
                      {scanResult.status === "success" ? (
                        <CheckCircle2 className="h-8 w-8 text-green-500 shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                      ) : scanResult.status === "warning" ? (
                        <AlertTriangle className="h-8 w-8 text-yellow-500 shrink-0 mt-1" />
                      ) : (
                        <XCircle className="h-8 w-8 text-red-500 shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold ${
                            scanResult.status === "success" ? "text-green-500" : 
                            scanResult.status === "warning" ? "text-yellow-500" : "text-red-500"
                          }`}>
                          {scanResult.message}
                        </h3>
                      </div>
                    </div>

                    {scanResult.details && (
                      <div className="space-y-6">
                        {scanResult.details.image && (
                          <div className="flex justify-center">
                            <img
                              src={scanResult.details.image}
                              alt="Gold Bar"
                              className="max-w-xs rounded-lg border border-border shadow-lg"
                            />
                          </div>
                        )}
                        
                        <div className="grid gap-4 sm:grid-cols-2">
                           <div className="space-y-1 rounded-lg bg-background/50 p-3">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Serial Number</p>
                            <p className="text-sm font-bold text-foreground font-mono">{scanResult.details.serialNumber}</p>
                          </div>
                           <div className="space-y-1 rounded-lg bg-background/50 p-3">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Status</p>
                            <p className="text-sm font-bold text-foreground">{scanResult.details.status}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border border-dashed border-border/50 rounded-xl text-center text-muted-foreground bg-card/30">
              <span className="flex items-center justify-center gap-2">
                 <Shield className="h-4 w-4" /> Secure Gold List Component (Disabled for Demo)
              </span>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start h-12 text-foreground hover:bg-muted" onClick={() => router.push("/history")}>
                  <div className="mr-3 rounded-full bg-primary/10 p-2 text-primary">
                     <History className="h-4 w-4" />
                  </div>
                  View Scan History
                </Button>
                <Button variant="ghost" className="w-full justify-start h-12 text-foreground hover:bg-muted">
                  <div className="mr-3 rounded-full bg-primary/10 p-2 text-primary">
                     <Settings className="h-4 w-4" />
                  </div>
                  Settings
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-6 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-primary/5">
                 <Shield className="h-32 w-32" />
              </div>
              <Shield className="h-8 w-8 text-primary mb-3 relative z-10" />
              <h3 className="text-lg font-bold text-foreground mb-2 relative z-10">Protected by Blockchain</h3>
              <p className="text-sm text-muted-foreground relative z-10">
                Every scan is verified against our immutable distributed ledger, ensuring 100% authenticity.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* History Modal Logic */}
      {showOwnershipHistory && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-card border border-border p-6 rounded-2xl max-w-md w-full">
                <h3 className="text-lg font-bold mb-4">Ownership History</h3>
                <div className="space-y-4 mb-6">
                   {/* Placeholder content */}
                   <p className="text-sm text-muted-foreground">No additional history available.</p>
                </div>
                <Button className="w-full" onClick={() => setShowOwnershipHistory(false)}>Close</Button>
            </div>
         </div>
      )}
    </div>
  )
}