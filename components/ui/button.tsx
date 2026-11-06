import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs sm:text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-95";
    const variants = {
      default:
        "theme-gradient-btn text-white shadow-[0_0_20px_rgba(16,185,129,0.35)]",
      destructive:
        "bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 shadow-sm",
      outline:
        "border border-white/10 bg-[#0a1222]/80 hover:bg-[#0a1222] hover:border-emerald-500/30 text-slate-200",
      secondary:
        "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white",
      ghost:
        "hover:bg-slate-800/60 text-slate-400 hover:text-white",
      link: "text-emerald-400 underline-offset-4 hover:underline",
    };
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-lg px-3 text-xs",
      lg: "h-11 rounded-2xl px-8 text-base",
      icon: "h-9 w-9 rounded-xl",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
