"use client"

import { PrivyProvider } from "@privy-io/react-auth"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        loginMethods: ["wallet"],
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "/images/design-mode/Verifly-2.png",
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}