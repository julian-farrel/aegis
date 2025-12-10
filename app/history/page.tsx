"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Scan,
  Package,
  Send,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface HistoryItem {
  id: string
  type: "scan" | "add" | "transfer"
  timestamp: string
  title: string
  description: string
  status: "success" | "warning" | "error"
  details?: any
}

export default function HistoryPage() {
  const [user, setUser] = useState<any>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem("aegis_user")
    if (!userData) {
      router.push("/")
    } else {
      setUser(JSON.parse(userData))
      loadHistory(JSON.parse(userData))
    }
  }, [router])

  const loadHistory = async (userData: any) => {
    setIsLoading(true)
    try {
      const wallet = userData.wallet?.toLowerCase()
      if (!wallet) return

      const supabase = createClient()
      const historyItems: HistoryItem[] = []

      // Load NFC scan history
      const { data: scans, error: scansError } = await supabase
        .from("scan_history")
        .select("*")
        .eq("user_wallet", wallet)
        .order("scanned_at", { ascending: false })

      if (!scansError && scans) {
        scans.forEach((scan) => {
          historyItems.push({
            id: scan.id,
            type: "scan",
            timestamp: scan.scanned_at,
            title: `NFC Scan - ${scan.details?.company || "Unknown"} ${scan.details?.weight || ""}g`,
            description: scan.message,
            status: scan.scan_result as "success" | "warning" | "error",
            details: scan.details,
          })
        })
      }

      // Load gold additions (from gold_items table)
      const { data: golds, error: goldsError } = await supabase
        .from("gold_items")
        .select("*")
        .eq("owner_wallet", wallet)
        .order("created_at", { ascending: false })

      if (!goldsError && golds) {
        golds.forEach((gold) => {
          historyItems.push({
            id: gold.id,
            type: "add",
            timestamp: gold.created_at,
            title: `Added to Collection - ${gold.distributor} ${gold.weight_grams}g`,
            description: `Serial: ${gold.serial_number}`,
            status: "success",
            details: {
              serialNumber: gold.serial_number,
              weight: gold.weight_grams,
              distributor: gold.distributor,
              purity: gold.purity,
              image: gold.image_url,
            },
          })
        })
      }

      // Load transfer history (outgoing transfers)
      const { data: transfers, error: transfersError } = await supabase
        .from("transfer_history")
        .select("*, gold_items(*)")
        .eq("from_wallet", wallet)
        .order("transfer_date", { ascending: false })

      if (!transfersError && transfers) {
        transfers.forEach((transfer: any) => {
          historyItems.push({
            id: transfer.id,
            type: "transfer",
            timestamp: transfer.transfer_date,
            title: `Transferred Gold - ${transfer.gold_items?.weight_grams || ""}g`,
            description: `To: ${transfer.to_wallet}`,
            status: transfer.verified ? "success" : "warning",
            details: {
              from: transfer.from_wallet,
              to: transfer.to_wallet,
              transactionHash: transfer.transaction_hash,
              goldItem: transfer.gold_items,
            },
          })
        })
      }

      // Sort all items by timestamp
      historyItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      setHistory(historyItems)
    } catch (error) {
      console.error("[v0] Error loading history:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getIcon = (type: string, status: string) => {
    if (type === "scan") {
      if (status === "success") return <CheckCircle2 className="h-5 w-5 text-green-500" />
      if (status === "warning") return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      return <XCircle className="h-5 w-5 text-red-500" />
    }
    if (type === "add") return <Package className="h-5 w-5 text-blue-500" />
    if (type === "transfer") return <Send className="h-5 w-5 text-purple-500" />
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-border bg-card border-b">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-12">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Activity History</h1>
              <p className="text-sm text-muted-foreground">View all your NFC scans, additions, and transfers</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12 lg:px-12">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading history...</p>
            </div>
          </div>
        ) : history.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <Scan className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">No Activity Yet</h2>
            <p className="text-muted-foreground mb-6">Start scanning gold bars to see your activity history</p>
            <Button onClick={() => router.push("/dashboard")} className="bg-primary text-primary-foreground">
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 rounded-full bg-background p-2">{getIcon(item.type, item.status)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(item.timestamp)}
                      </span>
                    </div>

                    {item.details && (
                      <button
                        onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                        className="flex items-center gap-2 text-sm text-primary hover:text-accent mt-2"
                      >
                        {expandedItem === item.id ? "Hide Details" : "Show Details"}
                        {expandedItem === item.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    )}

                    {expandedItem === item.id && item.details && (
                      <div className="mt-4 p-4 rounded-lg bg-background border border-border">
                        {/* Scan Details */}
                        {item.type === "scan" && (
                          <div className="space-y-3">
                            {item.details.image && (
                              <img
                                src={item.details.image || "/placeholder.svg"}
                                alt="Gold Bar"
                                className="max-w-xs rounded-lg border border-border"
                              />
                            )}
                            <div className="grid gap-2 sm:grid-cols-2 text-sm">
                              {item.details.serialNumber && (
                                <div>
                                  <span className="text-muted-foreground">Serial: </span>
                                  <span className="font-mono text-foreground">{item.details.serialNumber}</span>
                                </div>
                              )}
                              {item.details.weight && (
                                <div>
                                  <span className="text-muted-foreground">Weight: </span>
                                  <span className="text-foreground">{item.details.weight}g</span>
                                </div>
                              )}
                              {item.details.purity && (
                                <div>
                                  <span className="text-muted-foreground">Purity: </span>
                                  <span className="text-foreground">{item.details.purity}%</span>
                                </div>
                              )}
                              {item.details.status && (
                                <div>
                                  <span className="text-muted-foreground">Status: </span>
                                  <span
                                    className={item.details.status === "SEALED" ? "text-green-500" : "text-red-500"}
                                  >
                                    {item.details.status}
                                  </span>
                                </div>
                              )}
                              {item.details.hash && (
                                <div className="sm:col-span-2">
                                  <span className="text-muted-foreground">Hash: </span>
                                  <a
                                    href={`https://etherscan.io/tx/${item.details.hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-primary hover:text-accent inline-flex items-center gap-1"
                                  >
                                    <span className="truncate">{item.details.hash.slice(0, 16)}...</span>
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Add Details */}
                        {item.type === "add" && (
                          <div className="grid gap-2 text-sm">
                            {item.details.image && (
                              <img
                                src={item.details.image || "/placeholder.svg"}
                                alt="Gold Bar"
                                className="max-w-xs rounded-lg border border-border mb-2"
                              />
                            )}
                            <div>
                              <span className="text-muted-foreground">Serial: </span>
                              <span className="font-mono text-foreground">{item.details.serialNumber}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Weight: </span>
                              <span className="text-foreground">{item.details.weight}g</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Purity: </span>
                              <span className="text-foreground">{item.details.purity}%</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Distributor: </span>
                              <span className="text-foreground">{item.details.distributor}</span>
                            </div>
                          </div>
                        )}

                        {/* Transfer Details */}
                        {item.type === "transfer" && (
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">From: </span>
                              <span className="font-mono text-foreground break-all">{item.details.from}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">To: </span>
                              <span className="font-mono text-foreground break-all">{item.details.to}</span>
                            </div>
                            {item.details.transactionHash && (
                              <div>
                                <span className="text-muted-foreground">Transaction: </span>
                                <a
                                  href={`https://etherscan.io/tx/${item.details.transactionHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-mono text-primary hover:text-accent inline-flex items-center gap-1"
                                >
                                  <span className="truncate">{item.details.transactionHash.slice(0, 16)}...</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
