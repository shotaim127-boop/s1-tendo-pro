# Implementation Plan - Tournament App Enhancements & Bug Fixes

## User Requests & Objectives
1. **Dark Mode Fix**: Ensure dark mode toggle persists correctly across sessions and updates the app theme reliably (`ডার্ক মোড অন হয় নাহ`).
2. **Room ID & Password Notification**: When admin publishes Room ID & Password for a tournament, instantly notify enrolled users who booked slots (`যদি কেউ স্লট বুকিং করে থাকে তো যখনই পাসওয়ার্ড দিবে সাথে সাথে তার নোটিফিকেশন যায় যাতে`).
3. **Tournament Deletion**: Ensure tournament delete functionality works seamlessly in Admin Panel.
4. **Mode Image Customization**: Allow admin to change mode images (BR Match, Clash Squad, etc.) from local phone gallery with proper aspect ratio and persistence, managed via Admin Panel.
5. **Developer WhatsApp Contact**: Add WhatsApp developer contact (`01627290830`) with direct click-to-chat.

## Proposed Changes

### 1. `src/services/storage.ts`
- Enhance `StorageService` to persist dark mode state correctly (`localStorage.getItem('dark_mode')` or app settings state).
- Add notification storage/handling for room details publication so booked users receive notifications/alerts.
- Ensure tournament deletion properly cleans up bookings and tournament data.
- Support saving custom mode images in storage / state so admin changes persist.

### 2. `src/App.tsx` & Theme Handling
- Fix dark mode class toggling on `document.documentElement` or container (`dark` class).
- Add notification bell/badge in header or modal for tournament room credentials release.

### 3. `src/components/AdminPanel.tsx`
- Add UI controls for changing mode images via file picker (`FileReader` base64 or object URL).
- Ensure working tournament delete action button with confirmation.
- Ensure room ID & password publishing triggers notification creation for participants.

### 4. `src/components/Header.tsx` & ProfileScreen / SupportModal
- Add developer WhatsApp contact button (`01627290830` via `https://wa.me/8801627290830`).
- Show unread notifications badge for users when room ID is published.

## Verification Plan
- **Automated Tests**: Run `compile_applet` and `lint_applet` to verify TypeScript types and React build integrity.
- **Manual Checks**:
  - Test dark mode toggle and persistence.
  - Test admin room publication and user notification delivery.
  - Test tournament deletion.
  - Test mode image uploading in admin panel.
