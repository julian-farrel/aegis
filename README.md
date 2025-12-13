# Aegis: Blockchain-Based Gold Authenticity Verification

**Aegis** is a decentralized application (dApp) designed to combat gold counterfeiting by bridging physical assets with digital blockchain identities. Utilizing a "Phygital" (Physical + Digital) architecture, Aegis combines **NFC (Near Field Communication)** technology with **ERC-721 Smart Contracts** to create an immutable record of authenticity and ownership for gold bars.

## Core Concept

The system operates on a **Digital Twin** model:
1.  **Physical Layer:** Gold packaging is embedded with a cryptographic NFC tag containing a unique Serial Number.
2.  **Digital Layer:** A corresponding NFT is minted on the blockchain via the `AegisGold` smart contract.
3.  **Verification:** Scanning the NFC tag queries the blockchain. If the physical serial number matches the on-chain immutable record, the item is verified as authentic.

## Key Features

* **Instant Authenticity Check:** Verify gold origin and validity instantly by scanning the NFC-embedded packaging.
* **Immutable Ledger:** All data regarding the gold's creation and serial number is stored on the Ethereum blockchain, making it tamper-proof.
* **Busts Ownership History:** Trace the full lifecycle of a gold bar from the mint to the current owner via the `transferGold` mechanism.
* **User Dashboard:** A modern interface to manage your digital gold portfolio, view estimated values, and track transaction history.
* **Hybrid Architecture:** Combines the security of EVM smart contracts for asset logic with the speed of **Supabase** for user data and rich metadata handling.

## Tech Stack

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Language:** TypeScript
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/ui](https://ui.shadcn.com/)
* **Blockchain Interaction:** [Ethers.js](https://docs.ethers.org/) / Web3.js
* **Smart Contract:** Solidity (OpenZeppelin ERC-721)
* **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL & Auth)

## Project Structure

```bash
├── app/                  # Next.js App Router directories
│   ├── dashboard/        # User portfolio & main view
│   ├── gold-market/      # Marketplace for viewing assets
│   ├── history/          # Transaction and scan logs
│   ├── settings/         # Profile and app configuration
│   └── page.tsx          # Landing page
├── components/           # Reusable UI components
│   ├── ui/               # Shadcn UI primitives (cards, buttons, inputs)
│   ├── providers.tsx     # Context providers (Theme, Auth)
│   └── ...
├── lib/                  # Core logic utilities
│   ├── supabase.ts       # Supabase client configuration
│   ├── web3.ts           # Smart Contract interaction logic
│   └── utils.ts          # Helper functions
├── public/               # Static assets (images, icons)
├── scripts/              # SQL Database setup scripts
│   ├── 001_create_users_table.sql
│   ├── 002_create_gold_items_table.sql
│   └── ...
└── contracts/            # Smart Contract Source Code
```
## Getting Started

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn
* A Supabase project
* Metamask (or any Web3 wallet) installed in your browser

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/aegis.git](https://github.com/yourusername/aegis.git)
    cd aegis
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Configuration:**
    Create a `.env.local` file in the root directory and populate it with your Supabase keys:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Database Setup:**
    Execute the SQL scripts found in the `scripts/` folder inside your Supabase SQL Editor. This will create the necessary tables (`users`, `gold_items`, `scan_history`, etc.) and set up Row Level Security (RLS) policies.

5.  **Run the application:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the application.

## Smart Contract Integration

The platform interacts with the **AegisGold** smart contract. This contract extends the standard ERC-721 functionality to include direct on-chain mapping of physical serial numbers.

* **Contract Name:** `AegisGold`
* **Key Logic:**

    1.  **Mapping Physical to Digital:**
        The contract stores a direct link between the Token ID and the Physical Serial Number.
        ```solidity
        mapping(uint256 => string) public serialNumbers;
        ```

    2.  **Minting Process (`mintDemoGold`):**
        Used to register new gold bars. It mints the token and immediately locks the physical serial number into the blockchain state.
        ```solidity
        function mintDemoGold(address recipient, string memory _serialNumber) public returns (uint256) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(recipient, tokenId);
            serialNumbers[tokenId] = _serialNumber; // Immutable record
            // ... set URI ...
            return tokenId;
        }
        ```

    3.  **Verification:**
        The frontend calls the `serialNumbers(tokenId)` function to verify that the scanned NFC data matches the data stored on-chain.

## Security & Privacy

* **Data Integrity:** The Core "Truth" (Ownership and Serial Numbers) is stored on the Ethereum blockchain and cannot be altered by the app administrators or database hackers.
* **Off-Chain Privacy:** Personal user details and non-critical metadata are stored in Supabase with strict Row Level Security (RLS) policies, ensuring users only access their own data.

## Contributing

Contributions are always welcome!

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is licensed under the MIT License.
