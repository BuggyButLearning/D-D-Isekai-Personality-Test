import React from "react";

export function Card({ className = "", ...props }) {
  return <div className={`pixel-window text-[#fff0bf] ${className}`} {...props} />;
}

export function CardContent({ className = "", ...props }) {
  return <div className={className} {...props} />;
}
