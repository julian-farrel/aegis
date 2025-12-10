"use client"

import { Button } from "@/components/ui/button"
import { Shield, Smartphone, Link2, CheckCircle2, FileText } from "lucide-react"
import AnimatedBackground from "@/components/animated-background"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const router = useRouter()

  const handleGetStarted = () => {
    setShowAuthModal(true)
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    router.push("/dashboard")
  }

  const handleReadWhitepaper = () => {
    window.open(
      "https://aegiswhitepaper.notion.site/Aegis-Whitepaper-2ac764c825ed804dbbc3c896bcaf3834?source=copy_link",
      "_blank",
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <AnimatedBackground />

      {/* Header/Nav */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-2 py-2 lg:px-4 lg:py-2 bg-background/80 backdrop-blur-md border-b border-border/10">
        <div className="flex items-center gap-3">
          <img
            src="/images/design-mode/Verifly-2.png"
            alt="Aegis Logo"
            className="object-contain h-56 w-72 text-center border-0"
          />
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#benefits" className="text-foreground hover:text-primary transition-colors font-medium">
            Benefits
          </a>
          <a href="#trusted-by" className="text-foreground hover:text-primary transition-colors font-medium">
            Trusted By
          </a>
          <a href="#documentation" className="text-foreground hover:text-primary transition-colors font-medium">
            Documentation
          </a>
        </nav>

        <Button
          variant="outline"
          className="border-primary/30 text-foreground hover:bg-primary hover:text-primary-foreground bg-transparent"
        >
          Contact Us
        </Button>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-8 lg:px-12 lg:py-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary w-fit">
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
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-accent text-base"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 text-foreground hover:bg-primary/10 text-base bg-transparent"
                onClick={handleReadWhitepaper}
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative flex items-center justify-center">
            <div className="relative h-96 w-full">
              <img
                src="/images/design-mode/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsX29mZmljZV8yM19hX3JlYWxfcGhvdG9fb2ZfZ29sZF9iYXJzXzQ0NDE0OTY2LTg5NjMtNGEwZi05YzMwLThjNDBlYzRmOTMzZl8xLmpwZw.jpg.webp"
                alt="Gold Bars"
                className="h-full w-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="benefits" className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-12">
        <h2 className="text-balance mb-12 text-center text-4xl font-bold tracking-tight lg:text-5xl">
          <span className="text-foreground">How It Works&nbsp; </span>
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Step 1 */}
          <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-8 transition-all hover:border-primary/50">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Smartphone className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-card-foreground">Tap Your Phone</h3>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Simply tap your NFC-enabled smartphone to the gold bar packaging to initiate the authentication process.
            </p>
          </div>

          {/* Step 2 */}
          <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-8 transition-all hover:border-primary/50">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Link2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-card-foreground">Blockchain Verification</h3>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Our blockchain technology instantly checks the unique digital signature against our secure, distributed
              ledger.
            </p>
          </div>

          {/* Step 3 */}
          <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-8 transition-all hover:border-primary/50">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-card-foreground">Instant Results</h3>
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Receive immediate confirmation of authenticity with detailed product information and certification.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-8 lg:p-12">
            <h3 className="mb-4 text-2xl font-bold text-card-foreground">Unbreakable Security</h3>
            <p className="mb-6 text-pretty leading-relaxed text-muted-foreground">
              Powered by blockchain technology, each gold bar has a unique, immutable digital fingerprint that cannot be
              replicated or tampered with.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">Tamper-proof verification</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">Real-time authentication</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">Complete supply chain transparency</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-8 lg:p-12">
            <h3 className="mb-4 text-2xl font-bold text-card-foreground">Simple & Fast</h3>
            <p className="mb-6 text-pretty leading-relaxed text-muted-foreground">
              No special equipment needed. Just tap your smartphone to verify authenticity in seconds, anywhere,
              anytime.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">Works with any NFC phone</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">Instant verification results</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">No app download required</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Documentation Section */}
      <section id="documentation" className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-10 w-10 text-primary" />
            </div>
          </div>

          <h2 className="text-balance mb-6 text-4xl font-bold tracking-tight lg:text-5xl">
            <span className="text-foreground">Documentation</span>
          </h2>

          <p className="text-pretty mb-8 text-lg leading-relaxed text-muted-foreground lg:text-xl">
            Learn more about our blockchain-based authentication technology, NFC integration, and how Aegis is
            revolutionizing gold verification standards worldwide.
          </p>

          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-accent text-base gap-2"
            onClick={handleReadWhitepaper}
          >
            <FileText className="h-5 w-5" />
            Read Whitepaper
          </Button>
        </div>
      </section>

      {/* Partnership Section */}
      <section id="trusted-by" className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-12">
        <h2 className="text-balance mb-12 text-center text-4xl font-bold tracking-tight">
          <span className="text-foreground">Trusted By </span>
        </h2>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          <div className="flex items-center justify-center rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50">
            <img
              src="/images/design-mode/Logo-Lotus-Archi-Merah-1.png.webp"
              alt="Lotus Archi"
              className="h-16 object-contain transition-all hover:scale-110 w-44"
            />
          </div>

          <div className="flex items-center justify-center rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50">
            <img
              src="/images/design-mode/ubs.png"
              alt="UBS"
              className="h-16 w-auto object-contain transition-all hover:scale-110"
            />
          </div>

          <div className="flex items-center justify-center rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50">
            <img
              src="/images/design-mode/antam-logo-png_seeklogo-352008.png"
              alt="Antam"
              className="object-contain transition-all hover:scale-110 w-80 h-48"
            />
          </div>

          <div className="flex items-center justify-center rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50">
            <img
              src="/images/design-mode/30f71-logo-pusatemas.id_.png"
              alt="Pusatemas.id"
              className="h-16 w-auto object-contain transition-all hover:scale-110"
            />
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-12">
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-12 text-center">
          <h2 className="text-balance mb-4 text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Protect Your Investment Today
          </h2>
          <p className="text-pretty mb-8 text-lg text-muted-foreground">
            Join thousands of investors who trust Aegis to verify their gold authenticity
          </p>
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-accent text-base"
            onClick={handleGetStarted}
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border bg-card py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <img src="/images/aegis-logo.png" alt="Aegis Logo" className="h-8 w-8 object-contain" />
              <span className="text-xl font-bold text-card-foreground">Aegis</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Aegis. All rights reserved. Secured by blockchain technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
