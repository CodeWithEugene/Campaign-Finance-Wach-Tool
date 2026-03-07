# FedhaWatch Quick Start

Your Firebase project is configured! Follow these steps to complete the setup.

## 1. Get Firebase Admin Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/project/fedhawatch-318a8/settings/serviceaccounts/adminsdk)
2. Click **"Generate new private key"**
3. Download the JSON file
4. Open the JSON file and copy these values to `.env.local`:
   - `project_id` → `FIREBASE_ADMIN_PROJECT_ID`
   - `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY` (keep the quotes and \n characters)

Example:
```bash
FIREBASE_ADMIN_PROJECT_ID=fedhawatch-318a8
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@fedhawatch-318a8.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...\n-----END PRIVATE KEY-----\n"
```

## 2. Generate Security Salt

Run this command and copy the output to `.env.local`:

```bash
openssl rand -base64 32
```

Or use Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Add to `.env.local`:
```bash
HASH_SALT=your-generated-salt-here
```

## 3. Enable Firebase Services

### Firestore Database
1. Go to [Firestore](https://console.firebase.google.com/project/fedhawatch-318a8/firestore)
2. Click **"Create database"**
3. Choose **"Start in production mode"**
4. Select location: **eur3 (europe-west)** (closest to Kenya)
5. Click **"Enable"**

### Authentication
1. Go to [Authentication](https://console.firebase.google.com/project/fedhawatch-318a8/authentication)
2. Click **"Get started"**
3. Enable **"Email/Password"** provider
4. Enable **"Anonymous"** provider

### Storage
1. Go to [Storage](https://console.firebase.google.com/project/fedhawatch-318a8/storage)
2. Click **"Get started"**
3. Choose **"Start in production mode"**
4. Click **"Done"**

## 4. Deploy Firebase Rules

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in this project
firebase init

# Select:
# - Firestore
# - Storage
# - Use existing project: fedhawatch-318a8
# - Use existing files (firestore.rules, storage.rules, etc.)

# Deploy rules and indexes
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage
```

## 5. Install Dependencies

```bash
npm install
```

## 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 7. Create First Admin User

After enabling Authentication:

1. Create a user account in Firebase Console > Authentication
2. Copy the user's UID
3. Go to Firestore Database
4. Create a new collection: `adminUsers`
5. Add a document with the UID as document ID:

```json
{
  "uid": "the-user-uid-from-auth",
  "email": "admin@tikenya.org",
  "name": "Admin User",
  "role": "admin",
  "createdAt": [current timestamp]
}
```

## 8. Seed Initial Data

### Seed Political Parties

Create `scripts/seed-parties.ts`:

```typescript
import { adminDb } from './lib/firebase/admin'

const PARTIES = [
  { 
    name: 'Orange Democratic Movement', 
    abbreviation: 'ODM', 
    registeredDate: new Date('2005-01-01'),
    status: 'active',
    logoUrl: ''
  },
  { 
    name: 'United Democratic Alliance', 
    abbreviation: 'UDA', 
    registeredDate: new Date('2020-01-01'),
    status: 'active',
    logoUrl: ''
  },
  { 
    name: 'Azimio la Umoja - One Kenya Coalition', 
    abbreviation: 'AZIMIO', 
    registeredDate: new Date('2021-01-01'),
    status: 'active',
    logoUrl: ''
  },
  { 
    name: 'Wiper Democratic Movement', 
    abbreviation: 'WDM', 
    registeredDate: new Date('2007-01-01'),
    status: 'active',
    logoUrl: ''
  },
  { 
    name: 'Amani National Congress', 
    abbreviation: 'ANC', 
    registeredDate: new Date('2015-01-01'),
    status: 'active',
    logoUrl: ''
  },
]

async function seedParties() {
  console.log('Seeding parties...')
  for (const party of PARTIES) {
    const ref = await adminDb.collection('parties').add({
      ...party,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    console.log(`Added: ${party.name} (${ref.id})`)
  }
  console.log('Done!')
  process.exit(0)
}

seedParties().catch(console.error)
```

Run:
```bash
npx tsx scripts/seed-parties.ts
```

## 9. Test Report Submission

```bash
curl -X POST http://localhost:3000/api/reports \
  -F "title=Test Report" \
  -F "description=This is a test report with sufficient detail to meet the minimum character requirement" \
  -F "category=vote-buying" \
  -F "county=Nairobi" \
  -F "isAnonymous=true"
```

## 10. Optional: Configure Africa's Talking

For SMS and USSD functionality:

1. Sign up at [africastalking.com](https://africastalking.com)
2. Get sandbox credentials
3. Add to `.env.local`:
```bash
AT_API_KEY=your-api-key
AT_USERNAME=sandbox
```

4. Test USSD:
```bash
curl -X POST http://localhost:3000/api/ussd \
  -d "sessionId=test123" \
  -d "phoneNumber=+254712345678" \
  -d "text="
```

## 11. Optional: Configure Resend

For email alerts:

1. Sign up at [resend.com](https://resend.com)
2. Get API key
3. Add to `.env.local`:
```bash
RESEND_API_KEY=re_xxxxx
```

## Next Steps

Follow **IMPLEMENTATION_GUIDE.md** to build out the remaining features:
- Report submission form UI
- Public reports list page
- Interactive map
- PPF calculator
- Transparency index
- Admin dashboard

## Troubleshooting

### "Firebase Admin SDK not initialized"
- Make sure you've added the Admin credentials to `.env.local`
- Restart the dev server after adding environment variables

### "Permission denied" errors in Firestore
- Deploy the security rules: `firebase deploy --only firestore:rules`
- Check that the rules file exists: `firestore.rules`

### "Storage bucket not found"
- Enable Storage in Firebase Console
- Deploy storage rules: `firebase deploy --only storage`

### "Missing indexes" errors
- Deploy indexes: `firebase deploy --only firestore:indexes`
- Or create them automatically when Firestore suggests them

## Support

- Firebase Documentation: https://firebase.google.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Project Issues: Create a GitHub issue

---

**Your Firebase Project:** [fedhawatch-318a8](https://console.firebase.google.com/project/fedhawatch-318a8)

**Project ID:** `fedhawatch-318a8`
