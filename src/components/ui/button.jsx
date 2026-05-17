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

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${variants[variant] || variants.default} ${className}`}
      {...props}
    />
  );
}
