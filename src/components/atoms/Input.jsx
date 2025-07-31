import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  placeholder,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      placeholder={placeholder}
      className={cn(
        "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white",
        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
        "placeholder:text-gray-500",
        "transition-colors duration-200",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;