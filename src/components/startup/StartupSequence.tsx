"use client";

import { useState, useEffect } from "react";
import BootScreen from "./BootScreen";
import LoginScreen from "./LoginScreen";
import WelcomeScreen from "./WelcomeScreen";
import { useDesktopStore } from "@/store/useDesktopStore";

type StartupPhase = "boot" | "login" | "welcome" | "done";

interface StartupSequenceProps {
  children: React.ReactNode;
}

export default function StartupSequence({ children }: StartupSequenceProps) {
  const [phase, setPhase] = useState<StartupPhase>("boot");
  const sessionState = useDesktopStore((s) => s.sessionState);
  const setSessionState = useDesktopStore((s) => s.setSessionState);

  useEffect(() => {
    if (sessionState === "logged_out" && phase === "done") {
      setPhase("login");
      setSessionState("active");
    }
  }, [sessionState, phase, setSessionState]);

  // A simple sound player helper that we can use across components
  const playSound = (src: string) => {
    const audio = new Audio(src);
    audio.play().catch((e) => console.log("Audio play prevented by browser:", e));
  };

  if (phase === "done") {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden flex items-center justify-center text-white">
      {phase === "boot" && (
        <BootScreen onComplete={() => setPhase("login")} />
      )}
      {phase === "login" && (
        <LoginScreen onLogin={() => {
          playSound("/sounds/startup.mp3");
          setPhase("welcome");
        }} />
      )}
      {phase === "welcome" && (
        <WelcomeScreen onComplete={() => setPhase("done")} />
      )}
    </div>
  );
}
