'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function GoldMarketPage() {
  const router = useRouter()
  const [currency, setCurrency] = useState<'USD' | 'IDR'>('USD')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const currentPrice = currency === 'USD' ? 2043.50 : 32_456_000
  const priceChange = currency === 'USD' ? +12.30 : +195_680
  const percentChange = +0.61

  const distributorPrices = [
    {
      name: 'PT Aneka Tambang (Antam)',
      logo: 'antam.png',
      buyPrice: currency === 'USD' ? 2045 : 32_480_000,
      sellPrice: currency === 'USD' ? 2042 : 32_432_000,
      change: +0.58
    },
    {
      name: 'UBS Gold Bar',
      logo: 'ubs clear.png',
      buyPrice: currency === 'USD' ? 2046 : 32_496_000,
      sellPrice: currency === 'USD' ? 2041 : 32_416_000,
      change: +0.65
    },
    {
      name: 'Lotus Archi',
      logo: 'lotusarchi.webp',
      buyPrice: currency === 'USD' ? 2044 : 32_464_000,
      sellPrice: currency === 'USD' ? 2040 : 32_400_000,
      change: +0.52
    },
    {
      name: 'Pusat Emas',
      logo: 'pusatemas.webp',
      buyPrice: currency === 'USD' ? 2047 : 32_512_000,
      sellPrice: currency === 'USD' ? 2043 : 32_448_000,
      change: +0.70
    }
  ]

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

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

      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Gold Market Prices
            </h1>
            <p className="text-lg text-muted-foreground">
              Live gold prices from Indonesian distributors
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-border"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <div className="flex rounded-lg border border-border bg-card overflow-hidden">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  currency === 'USD'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                USD
              </button>
              <button
                onClick={() => setCurrency('IDR')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  currency === 'IDR'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                IDR
              </button>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-card p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-card-foreground">XAU/{currency} Spot Price</h2>
          </div>
          
          <div className="flex items-baseline gap-4">
            <span className="text-5xl font-bold text-foreground">
              {currency === 'USD' ? '$4,084.06' : 'Rp32,456,000'}
            </span>
            <div className="flex items-center gap-1 text-lg font-semibold text-green-500">
              <TrendingUp className="h-5 w-5" />
              {currency === 'USD' ? '$12.30 (+0.61%)' : 'Rp195,680 (+0.61%)'}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            Per 1 kilogram (1000 grams) • Last updated: {new Date().toLocaleString()}
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Indonesian Gold Distributors
          </h2>
          
          <div className="grid gap-6 lg:grid-cols-2">
            {distributorPrices.map((distributor) => (
              <div
                key={distributor.name}
                className="rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-background flex items-center justify-center p-2 border border-border/50">
                      <img
                        src={distributor.logo || "/placeholder.svg"}
                        alt={distributor.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-card-foreground text-lg">{distributor.name}</h3>
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        distributor.change > 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {distributor.change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {distributor.change > 0 ? '+' : ''}{distributor.change}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Buy Price (1 kg)</span>
                    <span className="text-lg font-bold text-green-500">
                      {currency === 'USD' ? '$' : 'Rp'}{distributor.buyPrice.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sell Price (1 kg)</span>
                    <span className="text-lg font-bold text-red-500">
                      {currency === 'USD' ? '$' : 'Rp'}{distributor.sellPrice.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Disclaimer:</strong> Prices shown are indicative and may vary. Please contact distributors directly for real-time quotes and availability.
          </p>
        </div>
      </main>
    </div>
  )
}