# FedhaWatch Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Firebase CLI: `npm install -g firebase-tools`
- Firebase project created at [console.firebase.google.com](https://console.firebase.google.com)
- Africa's Talking account (for SMS/USSD)
- Resend account (for email)

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project: `fedhawatch-kenya`
3. Enable Google Analytics (optional)

### 2. Enable Firebase Services

**Firestore Database:**
- Navigate to Firestore Database
- Click "Create database"
- Start in production mode
- Choose location: `eur3` (Europe) or closest to Kenya

**Authentication:**
- Navigate to Authentication
- Enable "Email/Password" provider
- Enable "Anonymous" provider

**Storage:**
- Navigate to Storage
- Click "Get started"
- Start in production mode

### 3. Get Firebase Configuration

**Client SDK (Web):**
- Go to Project Settings > General
- Scroll to "Your apps" > Add app > Web
- Register app: `FedhaWatch`
- Copy configuration values to `.env.local`

**Admin SDK (Server):**
- Go to Project Settings > Service Accounts
- Click "Generate new private key"
- Download JSON file
- Extract values to `.env.local`

## Environment Variables

Create `.env.local` file:

```bash
cp .env.example .env.local
```

Fill in all values from Firebase and other services.

## Installation

```bash
# Install dependencies
npm install

# Login to Firebase
firebase login

# Initialize Firebase (if not done)
firebase init

# Deploy Firestore rules and indexes
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage
```

## Database Seeding

### Seed Political Parties

Create `scripts/seed-parties.ts`:

```typescript
import { adminDb } from '@/lib/firebase/admin'

const PARTIES = [
  { name: 'Orange Democratic Movement', abbreviation: 'ODM', registeredDate: new Date('2005-01-01') },
  { name: 'United Democratic Alliance', abbreviation: 'UDA', registeredDate: new Date('2020-01-01') },
  { name: 'Azimio la Umoja', abbreviation: 'AZIMIO', registeredDate: new Date('2021-01-01') },
  // Add all 47+ registered parties
]

async function seedParties() {
  for (const party of PARTIES) {
    await adminDb.collection('parties').add({
      ...party,
      status: 'active',
      logoUrl: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}

seedParties()
```

Run: `npx tsx scripts/seed-parties.ts`

### Seed PPF Allocations

Manually parse ORPP PDFs or use the API endpoint:

```bash
curl -X POST http://localhost:3000/api/orpp/parse
```

## Africa's Talking Configuration

1. Sign up at [africastalking.com](https://africastalking.com)
2. Get API key and username
3. Configure webhooks in dashboard:
   - SMS Callback URL: `https://your-domain.vercel.app/api/sms/inbound`
   - USSD Callback URL: `https://your-domain.vercel.app/api/ussd`
4. Request shortcode `38383` and USSD code `*384*1234#`

## Resend Configuration

1. Sign up at [resend.com](https://resend.com)
2. Get API key
3. Verify domain for sending emails

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables on Vercel

Add all `.env.local` variables to Vercel project settings.

## Admin User Setup

Manually add first admin user to Firestore:

```javascript
// In Firebase Console > Firestore
// Collection: adminUsers
// Document ID: [Firebase Auth UID]
{
  uid: "firebase-auth-uid",
  email: "admin@tikenya.org",
  name: "Admin User",
  role: "admin",
  createdAt: new Date()
}
```

## Testing

### Test Report Submission

```bash
curl -X POST http://localhost:3000/api/reports \
  -F "title=Test Report" \
  -F "description=This is a test report with more than 20 characters" \
  -F "category=vote-buying" \
  -F "county=Nairobi" \
  -F "isAnonymous=true"
```

### Test USSD

Use Africa's Talking simulator or:

```bash
curl -X POST http://localhost:3000/api/ussd \
  -d "sessionId=test123" \
  -d "phoneNumber=+254712345678" \
  -d "text="
```

## Monitoring

- Firebase Console: Monitor Firestore usage, Storage, Auth
- Vercel Dashboard: Monitor deployments, logs, analytics
- Africa's Talking Dashboard: Monitor SMS/USSD usage

## Security Checklist

- [ ] All environment variables set
- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] HASH_SALT is strong random string
- [ ] Firebase Admin private key never committed
- [ ] Rate limiting tested
- [ ] EXIF stripping verified
- [ ] HTTPS enforced on Vercel

## Support

For issues, contact TI-Kenya or open GitHub issue.
