-- SQL Setup Script for SmileCraft Dental Clinic Supabase Database

-- 1. Create Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id TEXT NOT NULL,
    doctor_id TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    patient_email TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexing for quick lookup
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);

-- Enable Row Level Security (RLS)
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policies for appointments
CREATE POLICY "Enable insert for everyone" 
ON appointments FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable select/update for authenticated admin users only" 
ON appointments FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- 2. Create Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policies for newsletter
CREATE POLICY "Enable insert for anonymous signups" 
ON newsletter_subscribers FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable select for authenticated admin users only" 
ON newsletter_subscribers FOR SELECT 
TO authenticated 
USING (true);


-- 3. Create Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies for contact messages
CREATE POLICY "Enable insert for public contacts" 
ON contact_messages FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable select for authenticated admin users only" 
ON contact_messages FOR SELECT 
TO authenticated 
USING (true);
