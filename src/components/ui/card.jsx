import React from "react";

export function Card({ className = "", ...props }) {
  return <div className={`pixel-panel text-[#f8edcf] ${className}`} {...props} />;
}

export function CardContent({ className = "", ...props }) {
  return <div className={className} {...props} />;
}
