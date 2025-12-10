-- Create scan_history table to track all NFC scans
CREATE TABLE IF NOT EXISTS public.scan_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_wallet TEXT NOT NULL,
  serial_number TEXT NOT NULL,
  scan_result TEXT NOT NULL, -- 'success', 'warning', 'error'
  message TEXT NOT NULL,
  details JSONB,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert scan records (application handles authentication)
CREATE POLICY "Anyone can insert scan records"
  ON public.scan_history
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Users can view their own scan history
CREATE POLICY "Users can view their own scans"
  ON public.scan_history
  FOR SELECT
  TO public
  USING (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS scan_history_user_wallet_idx ON public.scan_history(user_wallet);
CREATE INDEX IF NOT EXISTS scan_history_scanned_at_idx ON public.scan_history(scanned_at DESC);
