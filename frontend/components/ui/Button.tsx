import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
 variant?:
 | "primary"
 | "secondary"
 | "outline"
 | "ghost"
 | "danger"
 | "success";
 size?: "sm" | "md" | "lg" | "icon";
 isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
 (
 {
 className,
 variant = "primary",
 size = "md",
 isLoading,
 children,
 disabled,
 ...props
 },
 ref,
 ) => {
 const variants = {
 primary:
 "bg-blue-600 text-white hover:bg-blue-700 active:scale-95",
 secondary:
 "bg-slate-200 text-slate-900 hover:bg-slate-300   ",
 outline:
 "border border-slate-300 bg-transparent hover:bg-slate-100  ",
 ghost: "bg-transparent hover:bg-slate-100 ",
 danger: "bg-red-600 text-white hover:bg-red-700 active:scale-95",
 success: "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95",
 };

 const sizes = {
 sm: "h-8 px-3 text-xs",
 md: "h-10 px-4 py-2",
 lg: "h-12 px-8 text-lg",
 icon: "h-10 w-10",
 };

 return (
 <button
 ref={ref}
 disabled={disabled || isLoading}
 className={cn(
 "inline-flex items-center justify-center rounded-[4px] font-normal transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none",
 variants[variant],
 sizes[size],
 className,
 )}
 {...props}
 >
 {isLoading ? (
 <div className="mr-2 h-4 w-4 animate-spin rounded-[4px] border-2 border-white border-t-transparent" />
 ) : null}
 {children}
 </button>
 );
 },
);

Button.displayName = "Button";

export { Button };
