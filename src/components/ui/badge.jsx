import React from "react";

const variants = {
  default: "bg-[#d85a24] text-[#fff2cf]",
  outline: "bg-[#fff2cf] text-[#171717]",
};

export function Badge({ className = "", variant = "default", ...props }) {
  const base =
    "pixel-badge inline-flex items-center px-3 py-2 text-[9px] font-bold leading-4";
  // If the caller passes an explicit bg-/text- override, drop the variant
  // defaults so two conflicting classes don't both reach the DOM (CSS-order
  // resolution would otherwise pick whichever the bundler emitted last).
  const callerOverridesBg = /\bbg-\[/.test(className);
  const callerOverridesText = /\btext-\[/.test(className);
  const variantCls = variants[variant] || variants.default;
  const filtered = variantCls
    .split(/\s+/)
    .filter((c) => {
      if (callerOverridesBg && c.startsWith("bg-")) return false;
      if (callerOverridesText && c.startsWith("text-")) return false;
      return true;
    })
    .join(" ");

  return <span className={`${base} ${filtered} ${className}`.trim()} {...props} />;
}
