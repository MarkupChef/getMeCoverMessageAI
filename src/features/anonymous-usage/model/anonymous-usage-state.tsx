"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ANONYMOUS_FREE_GENERATIONS_LIMIT,
  type AnonymousUsageResult,
  type AnonymousUsageSnapshot,
} from "@/entities/usage";
import {
  consumeAnonymousUsageLimitAction,
  getAnonymousUsageLimitAction,
} from "../api/actions";

type AnonymousUsageState =
  | AnonymousUsageSnapshot
  | {
      status: "error";
    };

type AnonymousUsageContextValue = {
  state: AnonymousUsageState;
  isLoading: boolean;
  isConsuming: boolean;
  initialize: () => void;
  consume: () => void;
};

const defaultAnonymousUsageState: AnonymousUsageSnapshot = {
  status: "available",
  used: 0,
  limit: ANONYMOUS_FREE_GENERATIONS_LIMIT,
  remaining: ANONYMOUS_FREE_GENERATIONS_LIMIT,
};

const AnonymousUsageContext = createContext<AnonymousUsageContextValue | null>(null);

let fingerprintVisitorIdPromise: Promise<string> | null = null;

function getFingerprintVisitorId() {
  fingerprintVisitorIdPromise ??= import("@fingerprintjs/fingerprintjs")
    .then((FingerprintJS) => FingerprintJS.load())
    .then((agent) => agent.get())
    .then((result) => result.visitorId);

  return fingerprintVisitorIdPromise;
}

function normalizeAnonymousUsageResult(
  result: AnonymousUsageResult,
): AnonymousUsageState {
  switch (result.status) {
    case "consumed":
      return {
        status: result.remaining > 0 ? "available" : "exhausted",
        used: result.used,
        limit: result.limit,
        remaining: result.remaining,
      };
    case "exhausted":
      return {
        status: "exhausted",
        used: result.used,
        limit: result.limit,
        remaining: result.remaining,
      };
    case "signup_required":
    case "unavailable":
      return result;
  }
}

export function AnonymousUsageProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AnonymousUsageState>(
    defaultAnonymousUsageState,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isConsuming, setIsConsuming] = useState(false);
  const initPromiseRef = useRef<Promise<void> | null>(null);
  const consumePromiseRef = useRef<Promise<void> | null>(null);
  const requestVersionRef = useRef(0);

  const initialize = useCallback(() => {
    if (initPromiseRef.current) {
      return;
    }

    setIsLoading(true);
    const requestVersion = requestVersionRef.current + 1;
    requestVersionRef.current = requestVersion;
    initPromiseRef.current = getFingerprintVisitorId()
      .then((deviceId) => getAnonymousUsageLimitAction({ deviceId }))
      .then((result) => {
        if (requestVersionRef.current === requestVersion) {
          setState(result);
        }
      })
      .catch(() => {
        if (requestVersionRef.current === requestVersion) {
          setState({ status: "error" });
        }
      })
      .finally(() => {
        setIsLoading(false);
        initPromiseRef.current = null;
      });
  }, []);

  const consume = useCallback(() => {
    if (consumePromiseRef.current) {
      return;
    }

    setIsConsuming(true);
    const requestVersion = requestVersionRef.current + 1;
    requestVersionRef.current = requestVersion;
    consumePromiseRef.current = getFingerprintVisitorId()
      .then((deviceId) => consumeAnonymousUsageLimitAction({ deviceId }))
      .then((result) => {
        if (requestVersionRef.current === requestVersion) {
          setState(normalizeAnonymousUsageResult(result));
        }
      })
      .catch(() => {
        if (requestVersionRef.current === requestVersion) {
          setState({ status: "error" });
        }
      })
      .finally(() => {
        setIsConsuming(false);
        consumePromiseRef.current = null;
      });
  }, []);

  const value = useMemo<AnonymousUsageContextValue>(
    () => ({
      state,
      isLoading,
      isConsuming,
      initialize,
      consume,
    }),
    [consume, initialize, isConsuming, isLoading, state],
  );

  return (
    <AnonymousUsageContext.Provider value={value}>
      {children}
    </AnonymousUsageContext.Provider>
  );
}

export function useAnonymousUsage() {
  const context = useContext(AnonymousUsageContext);

  if (!context) {
    throw new Error("useAnonymousUsage must be used within AnonymousUsageProvider");
  }

  return context;
}
