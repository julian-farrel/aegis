"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Scan,
  CheckCircle2,
  XCircle,
  Shield,
  LogOut,
  History,
  Smartphone,
  TrendingUp,
  Settings,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  AlertTriangle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import Link from "next/link"
import { QRCodeSVG } from "qrcode.react"
import { supabase } from "@/lib/supabase"
import { getEthereumContract, isValidAddress } from "@/lib/web3"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { ethers } from "ethers" 

export default function Dashboard() {
  const { user, authenticated, ready, logout } = usePrivy()
  const router = useRouter()

  // -- Scan State --
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<{
    status: "success" | "error" | "warning"
    message: string
    details?: any
  } | null>(null)

  // -- Wallet/Transfer State --
  const [isReceiveOpen, setIsReceiveOpen] = useState(false)
  const [isSendOpen, setIsSendOpen] = useState(false)
  const [userGoldItems, setUserGoldItems] = useState<any[]>([])
  const [selectedGoldId, setSelectedGoldId] = useState<string>("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [isProcessingTransfer, setIsProcessingTransfer] = useState(false)
  const [showOwnershipHistory, setShowOwnershipHistory] = useState(false)
  
  // New State for Minting
  const [isMinting, setIsMinting] = useState(false)

  // -- Auth Check --
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/")
    }
  }, [ready, authenticated, router])

  // -- Sync User to Database on Login --
  useEffect(() => {
    async function syncUserToDb() {
      if (ready && authenticated && user?.wallet?.address) {
        try {
          const walletAddress = user.wallet.address
          
          const { error } = await supabase
            .from('users')
            .upsert(
              { 
                wallet_address: walletAddress, 
                status: 'active', 
                updated_at: new Date().toISOString()
              }, 
              { onConflict: 'wallet_address' }
            )
          
          if (error) console.error("Error syncing user to DB:", error)
        } catch (err) {
          console.error("Unexpected error syncing user:", err)
        }
      }
    }

    syncUserToDb()
  }, [ready, authenticated, user?.wallet?.address])

  // -- Fetch User's Gold Items --
  useEffect(() => {
    async function fetchUserGold() {
      if (!user?.wallet?.address) return
      
      const { data, error } = await supabase
        .from('gold_items')
        .select('*')
        .eq('owner_wallet', user.wallet.address)

      if (data) {
        setUserGoldItems(data)
      }
    }

    if (authenticated) {
      fetchUserGold()
    }
  }, [authenticated, user?.wallet?.address, isMinting])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  // -- Mint Function --
  const handleMint = async () => {
    if (!user?.wallet?.address) return
    setIsMinting(true)

    try {
      const contract = await getEthereumContract()
      
      toast.info("Minting new gold bar on Sepolia...")
      const uri = "https://example.com/gold-metadata.json" 
      
      const tx = await contract.safeMint(user.wallet.address, uri)
      toast.info("Transaction sent! Waiting for confirmation...")
      
      const receipt = await tx.wait()
      
      let mintedTokenId = null
      
      for (const log of receipt.logs) {
        try {
          const parsedLog = contract.interface.parseLog(log)
          if (parsedLog && parsedLog.name === "Transfer") {
            mintedTokenId = parsedLog.args[2].toString()
            break
          }
        } catch (e) {
          continue
        }
      }

      if (!mintedTokenId) {
        throw new Error("Could not retrieve Token ID from transaction receipt")
      }

      console.log("Minted Token ID:", mintedTokenId)

      const serialNumber = `AG${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`
      
      const { error } = await supabase.from('gold_items').insert({
        owner_wallet: user.wallet.address,
        serial_number: serialNumber,
        weight_grams: 10,
        purity: "99.99%",
        distributor: "Aegis Mint",
        image_url: "aegis gold.jpeg",
        minted_date: new Date().toISOString(),
        certificate_id: `CERT-${serialNumber}`,
        token_id: parseInt(mintedTokenId),
        blockchain_hash: tx.hash
      })

      if (error) throw error

      toast.success(`Gold Bar #${mintedTokenId} Minted Successfully!`)
      
      const { data } = await supabase
        .from('gold_items')
        .select('*')
        .eq('owner_wallet', user.wallet.address)
      if (data) setUserGoldItems(data)

    } catch (error: any) {
      console.error("Mint failed:", error)
      toast.error(error.reason || error.message || "Mint failed")
    } finally {
      setIsMinting(false)
    }
  }

  // -- NFC Scan Logic --
  const handleNFCScan = async () => {
    setIsScanning(true)
    setScanResult(null)

    setTimeout(async () => {
      try {
        const simulatedSerialNumbers = ["LA000001", "AG000001", "AG000002", "UB000001", "FAKE123", "AG000003"]
        const scannedSerial = simulatedSerialNumbers[Math.floor(Math.random() * simulatedSerialNumbers.length)]

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

  // -- Handle Smart Contract Transfer --
  const handleSendGold = async () => {
    if (!selectedGoldId || !recipientAddress || !user?.wallet?.address) {
      toast.error("Please fill in all fields")
      return
    }

    if (!isValidAddress(recipientAddress)) {
      toast.error("Invalid wallet address")
      return
    }

    const selectedItem = userGoldItems.find(item => item.id === selectedGoldId)
    if (!selectedItem) {
      toast.error("Gold item not found")
      return
    }

    // Ensure valid Token ID
    if (selectedItem.token_id === null || selectedItem.token_id === undefined) {
       toast.error("This item is not linked to the blockchain (missing Token ID).")
       return
    }

    setIsProcessingTransfer(true)

    try {
      console.log("Checking if recipient user exists...")
      // FIX: Changed .single() to .maybeSingle() to prevent crash if user doesn't exist
      const { data: recipientUser, error: fetchError } = await supabase
        .from('users')
        .select('wallet_address')
        .eq('wallet_address', recipientAddress)
        .maybeSingle() 

      if (fetchError) {
        console.error("Error fetching recipient:", fetchError)
        // We continue because we can try to create them
      }

      // Create user if they don't exist
      if (!recipientUser) {
        console.log("Recipient not found, creating user...")
        const { error: insertError } = await supabase
           .from('users')
           .insert({ wallet_address: recipientAddress, status: 'active' })
        
        if (insertError) {
           console.error("Failed to create user:", insertError)
           // We throw here because foreign key constraints in transfer_history might fail otherwise
           throw new Error("Could not register recipient in database.") 
        }
      }

      console.log("Initiating blockchain transaction...")
      const contract = await getEthereumContract()
      
      const tx = await contract["safeTransferFrom(address,address,uint256)"](
        user.wallet.address, 
        recipientAddress, 
        selectedItem.token_id
      )
      
      toast.info("Transaction submitted. Waiting for confirmation...")
      await tx.wait()
      
      console.log("Updating database history...")
      const { error: historyError } = await supabase.from('transfer_history').insert({
        gold_item_id: selectedGoldId,
        from_wallet: user.wallet.address,
        to_wallet: recipientAddress,
        transaction_hash: tx.hash,
        verified: true
      })

      if (historyError) throw historyError

      const { error: itemError } = await supabase
        .from('gold_items')
        .update({ owner_wallet: recipientAddress })
        .eq('id', selectedGoldId)

      if (itemError) throw itemError

      toast.success("Gold transferred successfully on Blockchain!")
      
      // Close dialog and reset state
      setIsSendOpen(false)
      setRecipientAddress("")
      setSelectedGoldId("")
      
      // Refresh list
      const { data } = await supabase
        .from('gold_items')
        .select('*')
        .eq('owner_wallet', user.wallet.address)
      if (data) setUserGoldItems(data)

    } catch (error: any) {
      console.error("Transfer failed:", error)
      const errorMessage = error.reason || error.message || "Transfer failed"
      toast.error(errorMessage)
    } finally {
      setIsProcessingTransfer(false)
    }
  }

  const copyAddress = () => {
    if (user?.wallet?.address) {
      navigator.clipboard.writeText(user.wallet.address)
      toast.success("Address copied to clipboard")
    }
  }

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

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 shadow-[0_0_15px_-5px_var(--primary)] transition-colors hover:bg-primary/15">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]" />
              <span className="font-mono text-xs font-medium text-primary">
                {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
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

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-12">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back!
          </h1>
          <p className="text-muted-foreground">
            Manage your gold assets and verify ownership.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => setIsReceiveOpen(true)}
                className="h-24 flex-col gap-2 text-lg bg-card border border-border hover:bg-accent hover:text-accent-foreground text-foreground shadow-sm"
                variant="outline"
              >
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <ArrowDownLeft className="h-6 w-6" />
                </div>
                Receive Gold
              </Button>
              <Button 
                onClick={() => setIsSendOpen(true)}
                className="h-24 flex-col gap-2 text-lg bg-card border border-border hover:bg-accent hover:text-accent-foreground text-foreground shadow-sm"
                variant="outline"
              >
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <ArrowUpRight className="h-6 w-6" />
                </div>
                Send Gold
              </Button>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/30 group">
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
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start h-12 text-foreground hover:bg-muted" asChild>
                  <Link href="/history">
                    <div className="mr-3 rounded-full bg-primary/10 p-2 text-primary">
                       <History className="h-4 w-4" />
                    </div>
                    View History
                  </Link>
                </Button>
                
                <Button variant="ghost" className="w-full justify-start h-12 text-foreground hover:bg-muted" asChild>
                  <Link href="/gold-market">
                    <div className="mr-3 rounded-full bg-primary/10 p-2 text-primary">
                       <TrendingUp className="h-4 w-4" />
                    </div>
                    Gold Market
                  </Link>
                </Button>

                <Button variant="ghost" className="w-full justify-start h-12 text-foreground hover:bg-muted" asChild>
                  <Link href="/settings">
                    <div className="mr-3 rounded-full bg-primary/10 p-2 text-primary">
                       <Settings className="h-4 w-4" />
                    </div>
                    Settings
                  </Link>
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

      {/* Receive Dialog */}
      <Dialog open={isReceiveOpen} onOpenChange={setIsReceiveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Receive Gold</DialogTitle>
            <DialogDescription>
              Scan this QR code to receive gold assets to your wallet.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <div className="p-4 bg-white rounded-xl">
              {user?.wallet?.address && (
                <QRCodeSVG value={user.wallet.address} size={200} />
              )}
            </div>
            <div className="flex items-center gap-2 w-full">
              <div className="bg-muted p-3 rounded-lg text-xs font-mono break-all flex-1 text-center">
                {user?.wallet?.address}
              </div>
              <Button size="icon" variant="outline" onClick={copyAddress}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <DialogFooter>
             <Button onClick={() => setIsReceiveOpen(false)} className="w-full">Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Dialog */}
      <Dialog open={isSendOpen} onOpenChange={setIsSendOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Gold</DialogTitle>
            <DialogDescription>
              Transfer ownership of your gold assets to another wallet securely on the blockchain.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="gold-item">Select Gold Asset</Label>
              <Select value={selectedGoldId} onValueChange={setSelectedGoldId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gold bar..." />
                </SelectTrigger>
                <SelectContent>
                  {userGoldItems.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">No gold assets found</div>
                  ) : (
                    userGoldItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.serial_number} - {item.weight_grams}g ({item.purity})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Wallet Address</Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
            </div>

            <div className="rounded-lg bg-yellow-500/10 p-4 border border-yellow-500/20">
              <div className="flex gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
                <div className="text-xs text-yellow-600 dark:text-yellow-400">
                  <p className="font-semibold">Irreversible Action</p>
                  This transaction will be recorded on the blockchain and cannot be undone. Verify the address carefully.
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSendOpen(false)}>Cancel</Button>
            <Button onClick={handleSendGold} disabled={isProcessingTransfer}>
              {isProcessingTransfer ? (
                <>
                  <span className="animate-spin mr-2">⏳</span> Processing...
                </>
              ) : (
                "Confirm Transfer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {showOwnershipHistory && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-card border border-border p-6 rounded-2xl max-w-md w-full">
                <h3 className="text-lg font-bold mb-4">Ownership History</h3>
                <div className="space-y-4 mb-6">
                   <p className="text-sm text-muted-foreground">No additional history available.</p>
                </div>
                <Button className="w-full" onClick={() => setShowOwnershipHistory(false)}>Close</Button>
            </div>
         </div>
      )}
    </div>
  )
}