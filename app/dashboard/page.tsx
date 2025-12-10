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
            image: "/images/antam-emas-antam-10-gr-sertifikat-press-certieye-full03-p692qzhk.webp",
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-border bg-card border-b-0">
        <div className="max-w-full pl-0 pr-6 py-2 lg:pr-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/images/design-mode/Verifly-2(1).png" alt="Aegis Logo" className="object-contain w-52 h-40" />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                {user?.email?.address || user?.wallet?.address}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-border text-foreground hover:bg-muted bg-transparent"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome!</h1>
          <p className="text-lg text-muted-foreground">Scan your gold bars to verify authenticity</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Scan Section */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="rounded-full bg-primary/10 p-8">
                    <Smartphone className="h-16 w-16 text-primary" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-card-foreground mb-3">NFC Gold Verification</h2>
                <p className="text-muted-foreground mb-8">
                  Tap your phone to the gold bar packaging to verify authenticity
                </p>

                <Button
                  size="lg"
                  onClick={handleNFCScan}
                  disabled={isScanning}
                  className="bg-primary text-primary-foreground hover:bg-accent w-full max-w-sm h-14 text-lg gap-3"
                >
                  <Scan className={`h-6 w-6 ${isScanning ? "animate-pulse" : ""}`} />
                  {isScanning ? "Scanning..." : "Start NFC Scan"}
                </Button>

                {scanResult && (
                  <div className={`mt-8 rounded-xl border p-6 text-left ${
                      scanResult.status === "success" ? "border-green-500/50 bg-green-500/10" : 
                      scanResult.status === "warning" ? "border-yellow-500/50 bg-yellow-500/10" : 
                      "border-red-500/50 bg-red-500/10"
                    }`}>
                    <div className="flex items-start gap-4 mb-6">
                      {scanResult.status === "success" ? (
                        <CheckCircle2 className="h-8 w-8 text-green-500 shrink-0 mt-1" />
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
                              className="max-w-xs rounded-lg border-2 border-primary/30"
                            />
                          </div>
                        )}
                        
                        <div className="grid gap-4 sm:grid-cols-2">
                           <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Serial Number</p>
                            <p className="text-sm font-bold text-foreground">{scanResult.details.serialNumber}</p>
                          </div>
                          {/* Add other details as needed */}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 p-6 border border-dashed border-border rounded-xl text-center text-muted-foreground">
              (Gold List Component Disabled for Demo)
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-bold text-card-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent" onClick={() => router.push("/history")}>
                  <FileText className="mr-2 h-4 w-4" /> View History
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6">
              <Shield className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-bold text-foreground mb-2">Protected by Blockchain</h3>
              <p className="text-sm text-muted-foreground">
                Every scan is verified against our immutable distributed ledger
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* History Modal Logic */}
      {showOwnershipHistory && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            {/* Modal content */}
            <Button onClick={() => setShowOwnershipHistory(false)}>Close</Button>
         </div>
      )}
    </div>
  )
}