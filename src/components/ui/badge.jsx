import React from "react";

const variants = {
  default: "bg-[#d85a24] text-[#fff2cf]",
  outline: "bg-[#fff2cf] text-[#171717]",
};

export function Badge({ className = "", variant = "default", ...props }) {
  const base =
    "pixel-badge inline-flex items-center px-3 py-2 text-[9px] font-bold leading-4";

  return <span className={`${base} ${variants[variant] || variants.default} ${className}`} {...props} />;
}
