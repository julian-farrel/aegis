"use client"

import { Button } from "@/components/ui/button"
import { Shield, Smartphone, Link2, CheckCircle2, FileText, LogOut, Wallet } from "lucide-react"
import AnimatedBackground from "@/components/animated-background"
import { usePrivy, useLogin } from "@privy-io/react-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const router = useRouter()
  
  const { login } = useLogin({
    onComplete: () => {
      router.push("/dashboard")
    },
    onError: (error) => {
      console.error("Login error:", error)
    }
  })

  const { ready, authenticated, logout } = usePrivy()

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/dashboard")
    }
  }, [ready, authenticated, router])

  const handleReadWhitepaper = () => {
    window.open(
      "https://aegiswhitepaper.notion.site/Aegis-Whitepaper-2ac764c825ed804dbbc3c896bcaf3834?source=copy_link",
      "_blank",
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <AnimatedBackground />

      <header className="fixed top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 h-24 flex items-center justify-between">
          
          <div className="flex items-center gap-3 transition-opacity hover:opacity-80">
             <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_-3px_var(--primary)]">
                <img 
                  src="aegis.png" 
                  alt="Aegis Logo" 
                  className="h-7 w-auto object-contain"
                />
             </div>
             <span className="font-bold text-xl tracking-tight text-foreground">Aegis</span>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            <a href="#benefits" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Benefits
            </a>
            <a href="#trusted-by" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Trusted By
            </a>
            <a href="#documentation" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Documentation
            </a>
          </nav>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {ready && authenticated ? (
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => router.push("/dashboard")}
                  className="h-10 px-6 gap-2 font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:bg-primary/90 transition-all border border-primary/20 rounded-full"
                >
                  <Wallet className="h-4 w-4" />
                  Dashboard
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  onClick={login}
                  className="h-10 px-6 gap-2 font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:bg-primary/90 transition-all border border-primary/20 rounded-full"
                >
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-32 lg:px-12 lg:py-40">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col justify-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm text-primary w-fit animate-fade-in backdrop-blur-sm">
              <Shield className="h-4 w-4" />
              Blockchain-Secured Authentication
            </div>

            <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight text-foreground lg:text-7xl">
              Verify Gold <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-300">Instantly</span>
            </h1>

            <p className="text-pretty text-lg leading-relaxed text-muted-foreground lg:text-xl max-w-lg">
              Tap your phone to verify genuine gold bars with blockchain technology and NFC. Aegis provides instant
              verification to protect your investment.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row pt-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-accent text-base h-12 px-8 shadow-xl shadow-primary/20 transition-all hover:scale-105 rounded-full"
                onClick={ready && authenticated ? () => router.push("/dashboard") : login}
              >
                {ready && authenticated ? "Go to Dashboard" : "Get Started"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 text-foreground hover:bg-primary/5 text-base h-12 px-8 bg-transparent hover:border-primary/50 rounded-full"
                onClick={handleReadWhitepaper}
              >
                Read Whitepaper
              </Button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative h-[500px] w-full max-w-lg animate-float">
              <div className="absolute inset-0 bg-primary/30 blur-[100px] rounded-full opacity-50 transform translate-y-10"></div>
              
              <div className="relative rounded-3xl border border-white/10 overflow-hidden shadow-2xl backdrop-blur-sm bg-white/5 p-2">
                <img
                  src="gold.jpg"
                  alt="Gold Bars"
                  className="relative h-full w-full object-cover rounded-2xl"
                />
                
                <div className="absolute bottom-8 left-8 right-8 glass-card p-4 rounded-xl border border-white/20 bg-black/40 backdrop-blur-md flex items-center gap-4 animate-pulse">
                  <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80">Verification Status</p>
                    <p className="text-base font-bold text-white">Authentic Gold</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="benefits" className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-12">
        <h2 className="text-balance mb-16 text-center text-4xl font-bold tracking-tight lg:text-5xl">
          <span className="text-foreground">How It Works</span>
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors border border-primary/20">
              <Smartphone className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-card-foreground">Tap Your Phone</h3>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Simply tap your NFC-enabled smartphone to the gold bar packaging to initiate the authentication process.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors border border-primary/20">
              <Link2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-card-foreground">Blockchain Verification</h3>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Our blockchain technology instantly checks the unique digital signature against our secure, distributed
              ledger.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors border border-primary/20">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-card-foreground">Instant Results</h3>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Receive immediate confirmation of authenticity with detailed product information and certification.
            </p>
          </div>
        </div>
      </section>

     <section id="trusted-by" className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-12">
        <h2 className="text-balance mb-12 text-center text-4xl font-bold tracking-tight">
          <span className="text-foreground">Trusted By </span>
        </h2>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          <div className="flex items-center justify-center rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50">
            <img
              src="lotusarchi.webp"
              alt="Lotus Archi"
              className="object-contain transition-all hover:scale-110 w-80 h-48"
            />
          </div>

          <div className="flex items-center justify-center rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50">
            <img
              src="ubs clear.png"
              alt="UBS"
              className="object-contain transition-all hover:scale-110 w-80 h-48"
            />
          </div>

          <div className="flex items-center justify-center rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50">
            <img
              src="antam.png"
              alt="Antam"
              className="object-contain transition-all hover:scale-110 w-80 h-48"
            />
          </div>

          <div className="flex items-center justify-center rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50">
            <img
              src="pusatemas.webp"
              alt="Pusatemas.id"
              className="object-contain transition-all hover:scale-110 w-80 h-48"
            />
          </div>
        </div>
      </section>

      <section id="documentation" className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/20 shadow-lg shadow-primary/10">
              <FileText className="h-10 w-10 text-primary" />
            </div>
          </div>

          <h2 className="text-balance mb-6 text-4xl font-bold tracking-tight lg:text-5xl">
            Technical Documentation
          </h2>

          <p className="text-pretty mb-8 text-lg leading-relaxed text-muted-foreground lg:text-xl">
            Learn more about our blockchain-based authentication technology, NFC integration, and how Aegis is
            revolutionizing gold verification standards worldwide.
          </p>

          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white gap-2 h-12 px-8 rounded-full"
            onClick={handleReadWhitepaper}
          >
            <FileText className="h-5 w-5" />
            Read Whitepaper
          </Button>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border/40 bg-card/50 py-12 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <img src="aegis.png" alt="Aegis Logo" className="h-8 w-auto object-contain" />
              <span className="text-xl font-bold text-card-foreground">Aegis</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-right">
              © 2025 Aegis. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}