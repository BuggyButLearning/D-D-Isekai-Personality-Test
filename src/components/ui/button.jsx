import React from "react";

const variants = {
  default: "border-yellow-200 bg-[#f2c14e] text-[#120d08] hover:bg-[#ffe08a]",
  outline: "border-[#c8943a] bg-[#120d08] text-[#f8edcf] hover:bg-[#241a10] hover:text-[#fff6d8]",
  ghost: "border-transparent bg-transparent text-[#c9b88d] shadow-none hover:border-[#745124] hover:bg-[#120d08] hover:text-[#f8edcf]",
};

export function Button({
  className = "",
  variant = "default",
  type = "button",
  disabled,
  ...props
}) {
  const base =
    "rpg-button inline-flex min-h-10 items-center justify-center px-4 py-2 text-sm font-bold transition disabled:pointer-events-none disabled:opacity-50";

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${variants[variant] || variants.default} ${className}`}
      {...props}
    />
  );
}
