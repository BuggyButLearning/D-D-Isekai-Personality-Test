import React from "react";

const variants = {
  default: "bg-[#d85a24] text-[#fff2cf] hover:bg-[#ef7a32]",
  outline: "bg-[#fff2cf] text-[#171717] hover:bg-[#ffe5c9]",
  ghost: "bg-[#c7381d] text-[#fff2cf] hover:bg-[#df4c2a]",
};

export function Button({
  className = "",
  variant = "default",
  type = "button",
  disabled,
  ...props
}) {
  const base =
    "pixel-button inline-flex min-h-11 items-center justify-center px-4 py-2 text-[10px] font-bold leading-5 transition disabled:pointer-events-none disabled:opacity-60";
  // Strip default bg-/text-/hover:bg- when the caller provides their own,
  // so CSS-order resolution can't flip the rendered color randomly.
  const callerOverridesBg = /\bbg-\[/.test(className);
  const callerOverridesText = /\btext-\[/.test(className);
  const callerOverridesHoverBg = /\bhover:bg-\[/.test(className);
  const variantCls = variants[variant] || variants.default;
  const filtered = variantCls
    .split(/\s+/)
    .filter((c) => {
      if (callerOverridesBg && c.startsWith("bg-")) return false;
      if (callerOverridesText && c.startsWith("text-")) return false;
      if (callerOverridesHoverBg && c.startsWith("hover:bg-")) return false;
      return true;
    })
    .join(" ");

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${filtered} ${className}`.trim()}
      {...props}
    />
  );
}
