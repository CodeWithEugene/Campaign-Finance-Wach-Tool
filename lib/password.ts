/**
 * Standard password rules: 8+ characters, uppercase, lowercase, number, special character.
 */

const MIN_LENGTH = 8;
const HAS_UPPERCASE = /[A-Z]/;
const HAS_LOWERCASE = /[a-z]/;
const HAS_NUMBER = /[0-9]/;
const HAS_SPECIAL = /[^A-Za-z0-9]/;

export const PASSWORD_RULES = {
  minLength: MIN_LENGTH,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
} as const;

export type PasswordValidation = {
  valid: boolean;
  error?: string;
  checks: {
    minLength: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
};

export function validatePassword(password: string): PasswordValidation {
  const minLength = password.length >= MIN_LENGTH;
  const uppercase = HAS_UPPERCASE.test(password);
  const lowercase = HAS_LOWERCASE.test(password);
  const number = HAS_NUMBER.test(password);
  const special = HAS_SPECIAL.test(password);

  const checks = { minLength, uppercase, lowercase, number, special };
  const valid = minLength && uppercase && lowercase && number && special;

  let error: string | undefined;
  if (!valid) {
    const missing: string[] = [];
    if (!minLength) missing.push('at least 8 characters');
    if (!uppercase) missing.push('one uppercase letter');
    if (!lowercase) missing.push('one lowercase letter');
    if (!number) missing.push('one number');
    if (!special) missing.push('one special character (e.g. !@#$%^&*)');
    error = `Password must include ${missing.join(', ')}`;
  }

  return { valid, error, checks };
}
