import { createHash } from 'crypto'

export function hashWithSalt(value: string): string {
  const salt = process.env.HASH_SALT || 'default-salt-change-in-production'
  return createHash('sha256').update(value + salt).digest('hex')
}

export function hashEmail(email: string): string {
  return createHash('sha256').update(email.toLowerCase().trim()).digest('hex')
}

export function hashPhone(phone: string): string {
  return hashWithSalt(phone.replace(/\s+/g, ''))
}
