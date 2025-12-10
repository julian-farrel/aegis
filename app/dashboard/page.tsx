"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Scan, CheckCircle2, XCircle, Shield, LogOut, History,
  Smartphone, TrendingUp, Settings, ArrowUpRight, ArrowDownLeft,
  Copy, AlertTriangle, PlusCircle
} from "lucide-react"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import Link from "next/link"
import { QRCodeSVG } from "qrcode.react"
import { supabase } from "@/lib/supabase"
import { getEthereumContract, isValidAddress } from "@/lib/web3"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

export default function Dashboard() {
  const { user, authenticated, ready, logout } = usePrivy()
  const router = useRouter()

  // State
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [isReceiveOpen, setIsReceiveOpen] = useState(false)
  const [isSendOpen, setIsSendOpen] = useState(false)
  const [userGoldItems, setUserGoldItems] = useState<any[]>([])
  const [selectedGoldId, setSelectedGoldId] = useState<string>("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [isProcessingTransfer, setIsProcessingTransfer] = useState(false)
  const [showOwnershipHistory, setShowOwnershipHistory] = useState(false)
  const [isMinting, setIsMinting] = useState(false)

  // -- Auth & Sync --
  useEffect(() => {
    if (ready && !authenticated) router.push("/")
  }, [ready, authenticated, router])

  useEffect(() => {
    async function syncUserToDb() {
      if (ready && authenticated && user?.wallet?.address) {
        await supabase.from('users').upsert(
          { 
            wallet_address: user.wallet.address, 
            status: 'active', 
            updated_at: new Date().toISOString() 
          }, 
          { onConflict: 'wallet_address' }
        )
      }
    }
    syncUserToDb()
  }, [ready, authenticated, user?.wallet?.address])

  // -- Fetch Gold --
  useEffect(() => {
    async function fetchUserGold() {
      if (!user?.wallet?.address) return
      const { data } = await supabase
        .from('gold_items')
        .select('*')
        .eq('owner_wallet', user.wallet.address)
      if (data) setUserGoldItems(data)
    }
    if (authenticated) fetchUserGold()
  }, [authenticated, user?.wallet?.address, isMinting])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  // --- TRANSFER FUNCTION ---
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
    
    // Check Token ID (Allow 0)
    if (selectedItem.token_id === null || selectedItem.token_id === undefined) {
       toast.error("This item is not linked to the blockchain.")
       return
    }

    setIsProcessingTransfer(true)

    try {
      // 1. Auto-Register Recipient
      const { data: recipientUser } = await supabase
        .from('users').select('wallet_address')
        .eq('wallet_address', recipientAddress).single()

      if (!recipientUser) {
        await supabase.from('users').insert({ wallet_address: recipientAddress, status: 'active' })
      }

      // 2. Blockchain Transfer
      const contract = await getEthereumContract()
      const tx = await contract.transferGold(recipientAddress, selectedItem.token_id)
      
      toast.info("Transferring... Waiting for confirmation.")
      await tx.wait()
      
      // 3. Update DB
      await supabase.from('transfer_history').insert({
        gold_item_id: selectedGoldId,
        from_wallet: user.wallet.address,
        to_wallet: recipientAddress,
        transaction_hash: tx.hash,
        verified: true
      })

      await supabase.from('gold_items')
        .update({ owner_wallet: recipientAddress })
        .eq('id', selectedGoldId)

      toast.success("Transfer Successful!")
      setIsSendOpen(false)
      setRecipientAddress("")
      setSelectedGoldId("")
      
      // Refresh
      const { data } = await supabase.from('gold_items').select('*').eq('owner_wallet', user.wallet.address)
      if (data) setUserGoldItems(data)

    } catch (error: any) {
      console.error("Transfer failed:", error)
      toast.error(error.reason || error.message || "Transfer failed")
    } finally {
      setIsProcessingTransfer(false)
    }
  }

  // -- Scan Logic (Placeholder) --
  const handleNFCScan = async () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      setScanResult({ status: "success", message: "Verified", details: { serialNumber: "DEMO-123", status: "SEALED" } })
    }, 2000)
  }

  const copyAddress = () => {
    if (user?.wallet?.address) {
      navigator.clipboard.writeText(user.wallet.address)
      toast.success("Address copied!")
    }
  }

  if (!ready || !authenticated) return null

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-3">
            <img src="aegis.png" alt="Aegis Logo" className="h-10 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => setIsReceiveOpen(true)} className="h-24 flex-col gap-2" variant="outline">
                <ArrowDownLeft className="h-6 w-6 text-primary" /> Receive Gold
              </Button>
              <Button onClick={() => setIsSendOpen(true)} className="h-24 flex-col gap-2" variant="outline">
                <ArrowUpRight className="h-6 w-6 text-primary" /> Send Gold
              </Button>
            </div>

            <div className="relative overflow-hidden rounded-2xl border bg-card p-8 text-center">
                <Smartphone className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">NFC Gold Verification</h2>
                <Button size="lg" onClick={handleNFCScan} disabled={isScanning} className="gap-2">
                  <Scan className="h-4 w-4" /> {isScanning ? "Scanning..." : "Start NFC Scan"}
                </Button>
                {scanResult && (
                  <div className="mt-4 text-green-500 font-bold">{scanResult.message}</div>
                )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border bg-card p-6">
              <h3 className="text-sm font-bold uppercase text-muted-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/history"><History className="mr-2 h-4 w-4" /> History</Link>
                </Button>

                <Button variant="ghost" className="w-full justify-start h-12 text-foreground hover:bg-muted" asChild>
                  <Link href="/gold-market">
                    <div className="mr-3 rounded-full bg-primary/10 p-2 text-primary">
                       <TrendingUp className="h-4 w-4" />
                    </div>
                    Gold Market
                  </Link>
                </Button>

                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href="/settings"><Settings className="mr-2 h-4 w-4" /> Settings</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Receive Dialog */}
      <Dialog open={isReceiveOpen} onOpenChange={setIsReceiveOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Receive Gold</DialogTitle></DialogHeader>
          <div className="flex flex-col items-center gap-4">
             {user?.wallet?.address && <QRCodeSVG value={user.wallet.address} size={200} />}
             <div className="flex gap-2 items-center">
                <span className="text-xs font-mono">{user?.wallet?.address}</span>
                <Button size="icon" variant="outline" onClick={copyAddress}><Copy className="h-4 w-4"/></Button>
             </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Dialog */}
      <Dialog open={isSendOpen} onOpenChange={setIsSendOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Send Gold</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Select Gold</Label>
              <Select value={selectedGoldId} onValueChange={setSelectedGoldId}>
                <SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger>
                <SelectContent>
                  {userGoldItems.map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.serial_number} (ID: {item.token_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Recipient Address</Label>
              <Input placeholder="0x..." value={recipientAddress} onChange={e => setRecipientAddress(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSendGold} disabled={isProcessingTransfer}>
              {isProcessingTransfer ? "Processing..." : "Confirm Transfer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}