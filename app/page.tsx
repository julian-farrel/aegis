"use client"

import { Button } from "@/components/ui/button"
import { Shield, Smartphone, Link2, CheckCircle2, FileText, LogOut } from "lucide-react"
import AnimatedBackground from "@/components/animated-background"
import { usePrivy, useLogin } from "@privy-io/react-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const router = useRouter()
  
  // 1. Hook to handle the "Login" action (e.g., when clicking the button)
  const { login } = useLogin({
    onComplete: () => {
      // Runs immediately after a successful login flow
      router.push("/dashboard")
    },
    onError: (error) => {
      console.error("Login error:", error)
    }
  })

  // 2. Hook to check current status (e.g., if you refresh the page)
  const { ready, authenticated, logout } = usePrivy()

  // 3. Auto-Redirect: If you visit this page and are ALREADY logged in, go to dashboard
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

      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border/10 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src="/images/design-mode/Verifly-2.png"
            alt="Aegis Logo"
            className="object-contain h-12 w-auto"
          />
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#benefits" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Benefits
          </a>
          <a href="#trusted-by" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Trusted By
          </a>
          <a href="#documentation" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Documentation
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="hidden sm:flex border-primary/30 text-foreground hover:bg-primary hover:text-primary-foreground bg-transparent"
            onClick={() => window.location.href = 'mailto:contact@aegis.com'}
          >
            Contact Us
          </Button>
          
          {/* DYNAMIC HEADER BUTTONS */}
          {ready && authenticated ? (
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={logout}
                title="Click this to fix your 'stuck' state"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout (Fix)
              </Button>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-accent shadow-md"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </Button>
            </div>
          ) : (
            <Button 
              className="bg-primary text-primary-foreground hover:bg-accent shadow-md"
              onClick={login}
            >
              Login
            </Button>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:px-12 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="flex flex-col justify-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary w-fit animate-fade-in">
              <Shield className="h-4 w-4" />
              Blockchain-Secured Authentication
            </div>

            <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight text-foreground lg:text-7xl">
              Verify Gold Instantly
            </h1>

            <p className="text-pretty text-lg leading-relaxed text-muted-foreground lg:text-xl">
              Tap your phone to verify genuine gold bars with blockchain technology and NFC. Aegis provides instant
              verification to protect your investment from counterfeit products.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              {/* DYNAMIC HERO BUTTON */}
              {ready && authenticated ? (
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-accent text-base h-12 px-8 shadow-lg transition-transform hover:scale-105"
                  onClick={() => router.push("/dashboard")}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-accent text-base h-12 px-8 shadow-lg transition-transform hover:scale-105"
                  onClick={login}
                >
                  Get Started
                </Button>
              )}
              
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 text-foreground hover:bg-primary/10 text-base h-12 px-8 bg-transparent"
                onClick={handleReadWhitepaper}
              >
                Learn More
              </Button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative h-[500px] w-full max-w-lg">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-30 transform translate-y-4"></div>
              <img
                src="/images/design-mode/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsX29mZmljZV8yM19hX3JlYWxfcGhvdG9fb2ZfZ29sZF9iYXJzXzQ0NDE0OTY2LTg5NjMtNGEwZi05YzMwLThjNDBlYzRmOTMzZl8xLmpwZw.jpg.webp"
                alt="Gold Bars"
                className="relative h-full w-full object-cover rounded-2xl shadow-2xl border border-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="benefits" className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-12">
        <h2 className="text-balance mb-16 text-center text-4xl font-bold tracking-tight lg:text-5xl">
          <span className="text-foreground">How It Works</span>
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Smartphone className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-card-foreground">Tap Your Phone</h3>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Simply tap your NFC-enabled smartphone to the gold bar packaging to initiate the authentication process.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Link2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-card-foreground">Blockchain Verification</h3>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Our blockchain technology instantly checks the unique digital signature against our secure, distributed
              ledger.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-card-foreground">Instant Results</h3>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Receive immediate confirmation of authenticity with detailed product information and certification.
            </p>
          </div>
        </div>
      </section>

      {/* TRUSTED BY SECTION */}
      <section id="trusted-by" className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-12 bg-muted/30 rounded-3xl my-12">
        <h2 className="text-balance mb-12 text-center text-3xl font-bold tracking-tight">
          Trusted By Industry Leaders
        </h2>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12 items-center">
          {[
            { src: "/images/design-mode/Logo-Lotus-Archi-Merah-1.png.webp", alt: "Lotus Archi" },
            { src: "/images/design-mode/ubs.png", alt: "UBS" },
            { src: "/images/design-mode/antam-logo-png_seeklogo-352008.png", alt: "Antam" },
            { src: "/images/design-mode/30f71-logo-pusatemas.id_.png", alt: "Pusatemas.id" },
          ].map((logo, index) => (
            <div key={index} className="flex items-center justify-center p-6 grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-12 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </section>

      {/* DOCUMENTATION SECTION */}
      <section id="documentation" className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
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
            className="border-primary text-primary hover:bg-primary hover:text-white gap-2"
            onClick={handleReadWhitepaper}
          >
            <FileText className="h-5 w-5" />
            Read Whitepaper
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <img src="/images/design-mode/Verifly-2.png" alt="Aegis Logo" className="h-8 w-auto object-contain" />
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