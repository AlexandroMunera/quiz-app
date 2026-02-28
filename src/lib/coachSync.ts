import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CoachStoreV1 } from "@/hooks/useCoachStore";

const coachDocPath = (uid: string) => doc(db, "users", uid, "coach", "v1");

/**
 * Fetch the user's cloud coach progress.
 * Returns null if the document doesn't exist yet.
 */
export async function fetchCloudProgress(
  uid: string,
): Promise<CoachStoreV1["items"] | null> {
  const snap = await getDoc(coachDocPath(uid));
  if (!snap.exists()) return null;
  const data = snap.data() as { items: CoachStoreV1["items"] };
  return data.items ?? null;
}

/**
 * Persist the full items map to Firestore.
 * Uses setDoc (merge: false) to fully replace the document.
 */
export async function writeCloudProgress(
  uid: string,
  items: CoachStoreV1["items"],
): Promise<void> {
  await setDoc(coachDocPath(uid), { items });
}
