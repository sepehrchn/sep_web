-- Migration: Add phone column to contacts
-- Created: 2026-07-10

ALTER TABLE contacts ADD COLUMN phone TEXT;
