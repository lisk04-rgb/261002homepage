"use client";

import type { Analytics as FirebaseAnalytics } from "firebase/analytics";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getFirebaseApp, isFirebaseEnabled, measurementId } from "@/lib/firebase/config";

/** Firebase(Google) Analytics 페이지 조회 기록. MEASUREMENT_ID가 없으면 동작하지 않는다. */
export function Analytics() {
  const pathname = usePathname();
  const [analytics, setAnalytics] = useState<{
    instance: FirebaseAnalytics;
    logEvent: typeof import("firebase/analytics").logEvent;
  } | null>(null);

  useEffect(() => {
    if (!isFirebaseEnabled || !measurementId) return;
    import("firebase/analytics").then(async ({ getAnalytics, initializeAnalytics, isSupported, logEvent }) => {
      if (!(await isSupported())) return;
      let instance: FirebaseAnalytics;
      try {
        // 페이지 이동마다 직접 기록하므로 자동 첫 페이지뷰는 꺼서 중복 집계를 막는다.
        instance = initializeAnalytics(getFirebaseApp(), { config: { send_page_view: false } });
      } catch {
        instance = getAnalytics(getFirebaseApp());
      }
      setAnalytics({ instance, logEvent });
    });
  }, []);

  useEffect(() => {
    if (!analytics) return;
    analytics.logEvent(analytics.instance, "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [analytics, pathname]);

  return null;
}
