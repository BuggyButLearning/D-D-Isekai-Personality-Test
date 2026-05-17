import React from "react";

const variants = {
  default: "border-[#ffe08a] bg-[#f2c14e] text-[#120d08]",
  outline: "border-[#9f6f2e] bg-[#120d08] text-[#f8edcf]",
};

export function Badge({ className = "", variant = "default", ...props }) {
  const base =
    "rpg-badge inline-flex items-center border px-2.5 py-1 text-xs font-bold leading-5";

  return <span className={`${base} ${variants[variant] || variants.default} ${className}`} {...props} />;
}
