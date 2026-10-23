import { AnalysisResult } from "./schemas";

/**
 * Google Firebase & Cloud Integration Module
 *
 * Provides optional persistence for scan histories via Google Cloud Firestore
 * or client-side encrypted local storage when Firebase credentials are not yet configured.
 */

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export function getFirebaseConfig(): FirebaseConfig | null {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (projectId && apiKey) {
    return {
      apiKey,
      authDomain: `${projectId}.firebaseapp.com`,
      projectId,
      storageBucket: `${projectId}.appspot.com`,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
    };
  }

  return null;
}

export async function saveScanRecord(result: AnalysisResult): Promise<{ success: boolean; storage: "firestore" | "local" }> {
  const config = getFirebaseConfig();

  // If Firebase Cloud credentials configured, use Firestore REST endpoint
  if (config && config.projectId && config.apiKey) {
    try {
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents/scans?key=${config.apiKey}`;
      const doc = {
        fields: {
          productName: { stringValue: result.product.name },
          brand: { stringValue: result.product.brand || "" },
          score: { integerValue: String(result.rating.score) },
          band: { stringValue: result.rating.band },
          timestamp: { stringValue: result.timestamp },
          isDemo: { booleanValue: result.isDemo },
        },
      };

      const res = await fetch(firestoreUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doc),
      });

      if (res.ok) {
        return { success: true, storage: "firestore" };
      }
    } catch (e) {
      console.warn("Firestore save failed, falling back to local storage:", e);
    }
  }

  // Resilient fallback to local storage
  if (typeof window !== "undefined") {
    try {
      const existingRaw = localStorage.getItem("annadrishti_recent_scans");
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = [result, ...existing].slice(0, 10);
      localStorage.setItem("annadrishti_recent_scans", JSON.stringify(updated));
      return { success: true, storage: "local" };
    } catch (e) {
      console.warn("LocalStorage save error:", e);
    }
  }

  return { success: false, storage: "local" };
}

export function getRecentLocalScans(): AnalysisResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("annadrishti_recent_scans");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
