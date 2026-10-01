import { profileSchema, type Profile } from "../schemas/simulation";
import { STORAGE_KEY } from "./simulation";

const KEY = "takya.practice.profile";
const ACCESS_KEY = "takya.practice.access";
let transientProfile: Profile | null = null;
let transientAccess = false;

/** Navigation state for the client-only exercise; this is not authentication. */
export function beginPractice(profile: Profile) {
  saveProfile(profile);
  transientAccess = true;
  try {
    window.sessionStorage.setItem(ACCESS_KEY, "1");
  } catch {
    /* The current tab can continue without storage. */
  }
}

export function hasPracticeAccess(): boolean {
  try {
    return window.sessionStorage.getItem(ACCESS_KEY) === "1" || transientAccess;
  } catch {
    return transientAccess;
  }
}

export function endPractice() {
  transientAccess = false;
  transientProfile = null;
  try {
    window.sessionStorage.removeItem(ACCESS_KEY);
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* Navigation still ends the in-memory exercise. */
  }
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* The in-memory state is discarded by the following navigation. */
  }
}

export function saveProfile(profile: Profile) {
  transientProfile = profileSchema.parse(profile);
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(transientProfile));
  } catch {
    /* The current tab can continue without storage. */
  }
}

export function readProfile(): Profile | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return transientProfile;
    const value: unknown = JSON.parse(raw);
    const parsed = profileSchema.safeParse(value);
    return parsed.success ? parsed.data : transientProfile;
  } catch {
    return transientProfile;
  }
}
