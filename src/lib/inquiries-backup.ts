import fs from 'fs'
import path from 'path'

const BACKUP_FILE = path.join(process.cwd(), 'inquiries-backup.json')

export interface BackupInquiry {
  id: string
  inquiryType: 'kontakt' | 'narudzba' | 'b2b'
  orderNumber: string
  status: string
  customer: {
    fullName: string
    email: string
    phone?: string
  }
  shippingAddress?: {
    address?: string
    city?: string
    postalCode?: string
    country?: string
  }
  items?: unknown[]
  notes?: string
  createdAt: string
}

export function saveInquiryToBackup(inquiry: Omit<BackupInquiry, 'id'>): void {
  try {
    let existing: BackupInquiry[] = []
    if (fs.existsSync(BACKUP_FILE)) {
      const raw = fs.readFileSync(BACKUP_FILE, 'utf-8')
      existing = JSON.parse(raw)
    }

    const newItem: BackupInquiry = {
      id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...inquiry,
    }

    existing.unshift(newItem)
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(existing, null, 2), 'utf-8')
    console.log(`[InquiryBackup] Saved inquiry ${inquiry.orderNumber} locally to inquiries-backup.json`)
  } catch (err) {
    console.error('[InquiryBackup] Failed to save backup inquiry locally:', err)
  }
}
