-- Drop existing table if it exists
DROP TABLE IF EXISTS public.registered_golds CASCADE;

-- Create registered_golds table for verified gold bars
CREATE TABLE public.registered_golds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    serial_number TEXT UNIQUE NOT NULL,
    public_key TEXT UNIQUE NOT NULL,
    distributor TEXT NOT NULL,
    weight_grams NUMERIC NOT NULL,
    purity TEXT NOT NULL,
    manufacture_date DATE NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.registered_golds ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read registered golds (for verification)
CREATE POLICY "Anyone can view registered golds"
    ON public.registered_golds
    FOR SELECT
    USING (true);

-- Create index for fast serial number lookup
CREATE INDEX idx_registered_golds_serial ON public.registered_golds(serial_number);
CREATE INDEX idx_registered_golds_public_key ON public.registered_golds(public_key);

-- Insert sample verified gold bars
INSERT INTO public.registered_golds (serial_number, public_key, distributor, weight_grams, purity, manufacture_date, image_url) VALUES
-- Lotus Archi Gold Bars
('LA000001', '0x' || encode(gen_random_bytes(32), 'hex'), 'Lotus Archi', 10, '999.9', '2024-01-15', '/images/antam-emas-antam-10-gr-sertifikat-press-certieye-full03-p692qzhk.webp'),
('LA000002', '0x' || encode(gen_random_bytes(32), 'hex'), 'Lotus Archi', 25, '999.9', '2024-02-20', '/images/antam-emas-antam-10-gr-sertifikat-press-certieye-full03-p692qzhk.webp'),
('LA000003', '0x' || encode(gen_random_bytes(32), 'hex'), 'Lotus Archi', 50, '999.9', '2024-03-10', '/images/antam-emas-antam-10-gr-sertifikat-press-certieye-full03-p692qzhk.webp'),

-- Antam Gold Bars
('AG000001', '0x' || encode(gen_random_bytes(32), 'hex'), 'Antam', 10, '999.9', '2024-01-20', '/images/antam-emas-antam-10-gr-sertifikat-press-certieye-full03-p692qzhk.webp'),
('AG000002', '0x' || encode(gen_random_bytes(32), 'hex'), 'Antam', 25, '999.9', '2024-02-15', '/images/antam-emas-antam-10-gr-sertifikat-press-certieye-full03-p692qzhk.webp'),
('AG000003', '0x' || encode(gen_random_bytes(32), 'hex'), 'Antam', 50, '999.9', '2024-03-05', '/images/antam-emas-antam-10-gr-sertifikat-press-certieye-full03-p692qzhk.webp'),

-- UBS Gold Bars
('UB000001', '0x' || encode(gen_random_bytes(32), 'hex'), 'UBS', 10, '999.9', '2024-01-25', '/images/antam-emas-antam-10-gr-sertifikat-press-certieye-full03-p692qzhk.webp'),
('UB000002', '0x' || encode(gen_random_bytes(32), 'hex'), 'UBS', 25, '999.9', '2024-02-10', '/images/antam-emas-antam-10-gr-sertifikat-press-certieye-full03-p692qzhk.webp'),
('UB000003', '0x' || encode(gen_random_bytes(32), 'hex'), 'UBS', 50, '999.9', '2024-03-01', '/images/antam-emas-antam-10-gr-sertifikat-press-certieye-full03-p692qzhk.webp');

COMMENT ON TABLE public.registered_golds IS 'Registry of verified gold bars with unique public keys for authentication';
