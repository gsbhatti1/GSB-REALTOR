# GSB Realtor Mobile App — Build & Test Guide

## Prerequisites (install once on your computer)
```
Node.js 18+ — https://nodejs.org
npm install -g eas-cli
```

## Step 1 — Install dependencies
```bash
cd mobile
npm install
```

## Step 2 — Log in to Expo
```bash
eas login
# Use: gsbhatti1@gmail.com
```

## Step 3 — Link to Expo project (first time only)
```bash
eas init
# When asked: create a new project named "gsb-realtor"
# It will update eas.json with your real project ID automatically
```

---

## Option A — Test on a physical device RIGHT NOW (no build needed)

Install the **Expo Go** app on the test devices:
- iPhone: https://apps.apple.com/app/expo-go/id982107779
- Android: https://play.google.com/store/apps/details?id=host.exp.exponent

Then from the mobile/ folder run:
```bash
npx expo start
```
Scan the QR code with the Expo Go app. The app loads instantly on the device.

> ⚠️ Note: Apple Sign In won't work in Expo Go (needs a real build). Everything else works.

---

## Option B — Build a shareable APK (Android) for testers

```bash
cd mobile
eas build --platform android --profile preview
```
- Builds an .apk file you can send directly to testers
- No Google Play account needed
- EAS emails you the download link when done (~15-20 min)
- Testers install it by opening the link on their Android phone

---

## Option C — Build for iOS TestFlight

```bash
cd mobile
eas build --platform ios --profile preview
```
- Requires Apple Developer account (you have: MFZGLC37WW) ✅
- EAS handles code signing automatically
- Download link emailed when done (~20-30 min)
- Upload to TestFlight: `eas submit --platform ios`

---

## Option D — Build BOTH platforms at once

```bash
cd mobile
eas build --platform all --profile preview
```

---

## What testers will see

| Screen | What to test |
|--------|-------------|
| Splash | Animated G monogram, gold line, brand name |
| Home | 4 lane cards, city chips, call/text buttons |
| Search | Type a city → listings load, filters work, load more |
| Property | Photo swipe, Save ♥, Share, Request Showing |
| Lead form | Fill out form → submit → success screen |
| Saved | Properties saved persist after closing app |
| Profile | Apple Sign In (iOS), contact options |

## Known limitations in preview build
- Apple Sign In: iOS only, requires real device (not simulator)
- Location: requires permission grant on first launch
- Photos: loaded from live WFRMLS — needs internet connection

## Credentials
- Expo account: gsbhatti1@gmail.com
- Apple Team ID: MFZGLC37WW
- iOS Bundle ID: com.gsbrealtor.app
- Android Package: com.gsbrealtor.app
- Supabase: https://hgsxndnxyczhudhsbddo.supabase.co
