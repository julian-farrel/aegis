-- Add password column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_wallet VARCHAR NOT NULL,
  sender_wallet VARCHAR NOT NULL,
  gold_item_id UUID REFERENCES gold_items(id) ON DELETE CASCADE,
  notification_type VARCHAR NOT NULL DEFAULT 'transfer_request',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_recipient FOREIGN KEY(recipient_wallet) REFERENCES users(wallet_address) ON DELETE CASCADE,
  CONSTRAINT fk_sender FOREIGN KEY(sender_wallet) REFERENCES users(wallet_address) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_wallet);
