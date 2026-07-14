import { permanentRedirect } from 'next/navigation';

// Retired 2026-07-14. The control room was built on the older 5-movement
// "Sit down and ask us" spine; the deck now lives at /pitch/deck on the
// signed 6-turn narrative foundation. Keep this route as a permanent
// redirect so any existing links land on the current deck.
export default function PitchControlRoomPage() {
  permanentRedirect('/pitch/deck');
}
