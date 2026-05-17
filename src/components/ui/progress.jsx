import React from "react";

export function Progress({ className = "", value = 0, ...props }) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className={`xp-bar relative overflow-hidden ${className}`} {...props}>
      <div className="xp-bar-fill" style={{ width: `${clamped}%` }} />
    </div>
  );
}
