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
import MyGoldsList from "@/components/my-golds-list"
import { createClient } from "@/lib/supabase/client"
import NotificationsBell from "@/components/notifications-bell"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<{
    status: "success" | "error" | "warning"
    message: string
    details?: any
  } | null>(null)
  const router = useRouter()
  const [showOwnershipHistory, setShowOwnershipHistory] = useState(false)
  const [goldRefreshTrigger, setGoldRefreshTrigger] = useState(0)

  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem("aegis_user")
    if (!userData) {
      router.push("/")
    } else {
      setUser(JSON.parse(userData))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("aegis_user")
    router.push("/")
  }

  const handleGoldAccepted = () => {
    setGoldRefreshTrigger((prev) => prev + 1)
  }

  const handleNFCScan = async () => {
    setIsScanning(true)
    setScanResult(null)

    setTimeout(async () => {
      try {
        const supabase = createClient()

        // Simulate reading serial number from NFC tag
        const simulatedSerialNumbers = ["LA000001", "AG000001", "AG000002", "UB000001", "FAKE123", "AG000003"]
        const scannedSerial = simulatedSerialNumbers[Math.floor(Math.random() * simulatedSerialNumbers.length)]

        console.log("[v0] Scanned serial number:", scannedSerial)

        // Check if serial number is registered in the database
        const { data: registeredGold, error } = await supabase
          .from("registered_golds")
          .select("*")
          .eq("serial_number", scannedSerial)
          .single()

        if (error || !registeredGold) {
          console.log("[v0] Serial number not found in registry")

          const scanResultData = {
            status: "error" as const,
            message: "Invalid Serial Number",
            details: {
              serialNumber: scannedSerial,
              reason: "This serial number is not registered in our verified gold registry",
              recommendation: "Please verify with the distributor or check if the NFC tag is authentic",
            },
          }

          // Save failed scan to history
          await supabase.from("scan_history").insert({
            user_wallet: user?.wallet?.toLowerCase() || "",
            serial_number: scannedSerial,
            scan_result: "error",
            message: scanResultData.message,
            details: scanResultData.details,
          })

          setScanResult(scanResultData)
          setIsScanning(false)
          return
        }

        console.log("[v0] Registered gold found:", registeredGold)

        // Check tamper status randomly for demo
        const isTampered = Math.random() > 0.7

        const ownershipHistory = [
          {
            wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
            date: "2024-11-10 14:23:45",
            action: "Transfer",
          },
          {
            wallet: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
            date: "2024-08-15 09:12:30",
            action: "Transfer",
          },
          {
            wallet: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
            date: new Date(registeredGold.manufacture_date).toLocaleDateString(),
            action: "Minted",
          },
        ]

        const scanResultData = {
          status: isTampered ? ("warning" as const) : ("success" as const),
          message: isTampered ? "Warning: Packaging Opened Detected" : "Gold bar authenticated successfully!",
          details: {
            image:
              registeredGold.image_url ||
              "/images/antam-emas-antam-10-gr-sertifikat-press-certieye-full03-p692qzhk.webp",
            serialNumber: registeredGold.serial_number,
            weight: registeredGold.weight_grams.toString(),
            purity: registeredGold.purity,
            company: registeredGold.distributor,
            verifiedOn: new Date().toLocaleString(),
            currentOwner: user?.wallet || "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
            status: isTampered ? "PACKAGING OPENED" : "SEALED",
            hash: registeredGold.public_key,
            ownershipHistory: ownershipHistory,
          },
        }

        // Save successful scan to history
        await supabase.from("scan_history").insert({
          user_wallet: user?.wallet?.toLowerCase() || "",
          serial_number: registeredGold.serial_number,
          scan_result: scanResultData.status,
          message: scanResultData.message,
          details: scanResultData.details,
        })

        console.log("[v0] Scan saved to database")
        setScanResult(scanResultData)
      } catch (error) {
        console.error("[v0] Error during scan:", error)
        setScanResult({
          status: "error",
          message: "Scan Error",
          details: {
            reason: "An error occurred during the scan process",
          },
        })
      } finally {
        setIsScanning(false)
      }
    }, 2000)
  }

  if (!user) return null

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
              <NotificationsBell userWallet={user?.wallet || ""} onGoldAccepted={handleGoldAccepted} />
              <span className="text-sm text-muted-foreground">{user.email || user.wallet}</span>
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back{user.name ? `, ${user.name}` : ""}!</h1>
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
                  Tap your phone to the gold bar packaging to verify authenticity using blockchain technology
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
                  <div
                    className={`mt-8 rounded-xl border p-6 text-left ${
                      scanResult.status === "success"
                        ? "border-green-500/50 bg-green-500/10"
                        : scanResult.status === "warning"
                          ? "border-yellow-500/50 bg-yellow-500/10"
                          : "border-red-500/50 bg-red-500/10"
                    }`}
                  >
                    <div className="flex items-start gap-4 mb-6">
                      {scanResult.status === "success" ? (
                        <CheckCircle2 className="h-8 w-8 text-green-500 shrink-0 mt-1" />
                      ) : scanResult.status === "warning" ? (
                        <AlertTriangle className="h-8 w-8 text-yellow-500 shrink-0 mt-1" />
                      ) : (
                        <XCircle className="h-8 w-8 text-red-500 shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <h3
                          className={`text-xl font-bold ${
                            scanResult.status === "success"
                              ? "text-green-500"
                              : scanResult.status === "warning"
                                ? "text-yellow-500"
                                : "text-red-500"
                          }`}
                        >
                          {scanResult.message}
                        </h3>
                      </div>
                    </div>

                    {scanResult.details && scanResult.details.image && (
                      <div className="space-y-6">
                        {/* Gold Bar Image */}
                        <div className="flex justify-center">
                          <img
                            src={scanResult.details.image || "/placeholder.svg"}
                            alt="Gold Bar"
                            className="max-w-xs rounded-lg border-2 border-primary/30"
                          />
                        </div>

                        {/* Detailed Information Grid */}
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Serial Number</p>
                            <p className="text-sm font-bold text-foreground">{scanResult.details.serialNumber}</p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Weight</p>
                            <p className="text-sm font-bold text-foreground">{scanResult.details.weight}g</p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Purity</p>
                            <p className="text-sm font-bold text-foreground">{scanResult.details.purity}%</p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Company</p>
                            <p className="text-sm font-bold text-foreground">{scanResult.details.company}</p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Verified On</p>
                            <p className="text-sm font-bold text-foreground">{scanResult.details.verifiedOn}</p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">Status</p>
                            <p
                              className={`text-sm font-bold ${
                                scanResult.details.status === "SEALED" ? "text-green-500" : "text-red-500"
                              }`}
                            >
                              {scanResult.details.status}
                            </p>
                          </div>
                        </div>

                        {/* Current Owner - Clickable */}
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Current Owner</p>
                          <button
                            onClick={() => setShowOwnershipHistory(true)}
                            className="flex items-center gap-2 text-sm font-mono text-primary hover:text-accent transition-colors"
                          >
                            <span className="truncate">{scanResult.details.currentOwner}</span>
                            <History className="h-4 w-4 shrink-0" />
                          </button>
                        </div>

                        {/* Transaction Hash */}
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">Transaction Hash</p>
                          <a
                            href={`https://etherscan.io/tx/${scanResult.details.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm font-mono text-primary hover:text-accent transition-colors break-all"
                          >
                            <span className="truncate">{scanResult.details.hash}</span>
                            <ExternalLink className="h-4 w-4 shrink-0" />
                          </a>
                        </div>
                      </div>
                    )}

                    {scanResult.details && !scanResult.details.image && (
                      <div className="mt-4 space-y-2">
                        {Object.entries(scanResult.details).map(([key, value]) => (
                          <div key={key} className="flex justify-between border-b border-border/50 pb-2">
                            <span className="text-sm text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}:
                            </span>
                            <span className="text-sm font-medium text-foreground">{value as string}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* My Golds List Section */}
            <MyGoldsList key={`golds-${goldRefreshTrigger}`} />
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-bold text-card-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/")}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/gold-market")}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Check Gold Market
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => router.push("/history")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View History
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
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

      {showOwnershipHistory && scanResult?.details?.ownershipHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative w-full max-w-2xl max-h-[80vh] overflow-auto rounded-2xl border border-border bg-card p-6 m-4">
            <button
              onClick={() => setShowOwnershipHistory(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold text-foreground mb-6">Ownership History</h2>

            <div className="space-y-4">
              {scanResult.details.ownershipHistory.map((record: any, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-4 border border-border rounded-lg p-4 bg-background/50"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-primary uppercase">{record.action}</span>
                      <span className="text-xs text-muted-foreground">{record.date}</span>
                    </div>
                    <a
                      href={`https://etherscan.io/address/${record.wallet}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-mono text-foreground hover:text-primary transition-colors"
                    >
                      <span className="truncate">{record.wallet}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
