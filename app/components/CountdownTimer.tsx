"use client";

import { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface CountdownTimerProps {
  deadline: bigint;  // Unix timestamp
  compact?: boolean;
}

export default function CountdownTimer({ deadline, compact = false }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const update = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = Number(deadline) - now;

      if (diff <= 0) {
        setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }

      setRemaining({
        days: Math.floor(diff / 86400),
        hours: Math.floor((diff % 86400) / 3600),
        minutes: Math.floor((diff % 3600) / 60),
        seconds: diff % 60,
        expired: false,
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (remaining.expired) {
    return (
      <div className="flex items-center gap-1.5 text-red-400">
        <AlertTriangle className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">Deadline expired</span>
      </div>
    );
  }

  const isUrgent = remaining.days === 0 && remaining.hours < 24;

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 ${isUrgent ? "text-yellow-400" : "text-slate-400"}`}>
        <Clock className="h-3 w-3" />
        <span className="text-xs font-mono">
          {remaining.days > 0 ? `${remaining.days}d ` : ""}
          {String(remaining.hours).padStart(2, "0")}:{String(remaining.minutes).padStart(2, "0")}:{String(remaining.seconds).padStart(2, "0")}
        </span>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-3 ${isUrgent ? "border-yellow-500/30 bg-yellow-500/5" : "border-white/10 bg-white/5"}`}>
      <div className="flex items-center gap-1.5 mb-2">
        <Clock className={`h-3.5 w-3.5 ${isUrgent ? "text-yellow-400" : "text-slate-400"}`} />
        <span className={`text-xs font-medium ${isUrgent ? "text-yellow-300" : "text-slate-400"}`}>
          {isUrgent ? "⚠ Deadline approaching" : "Deadline"}
        </span>
      </div>
      <div className="flex gap-2">
        {[
          { label: "Days", value: remaining.days },
          { label: "Hrs", value: remaining.hours },
          { label: "Min", value: remaining.minutes },
          { label: "Sec", value: remaining.seconds },
        ].map((unit) => (
          <div key={unit.label} className="flex-1 text-center">
            <p className={`text-lg font-bold font-mono ${isUrgent ? "text-yellow-300" : "text-white"}`}>
              {String(unit.value).padStart(2, "0")}
            </p>
            <p className="text-[10px] text-slate-500">{unit.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
