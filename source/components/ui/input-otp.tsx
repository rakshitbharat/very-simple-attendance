"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface InputOTPProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  className?: string;
}

export const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
  ({ value, onChange, maxLength = 4, className, ...props }, ref) => {
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    const handleInput = (index: number, inputValue: string) => {
      const newValue = value.split("");
      newValue[index] = inputValue;
      const finalValue = newValue.join("").slice(0, maxLength);
      onChange(finalValue);

      // Move to next input if there's a value
      if (inputValue && index < maxLength - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (
      index: number,
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key === "Backspace" && !value[index] && index > 0) {
        // Move to previous input on backspace if current input is empty
        inputRefs.current[index - 1]?.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text").slice(0, maxLength);
      onChange(pastedData);
    };

    return (
      <div ref={ref} className={cn("flex gap-2 justify-center", className)}>
        {Array.from({ length: maxLength }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) =>
              handleInput(index, e.target.value.replace(/\D/g, ""))
            }
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={cn(
              "w-10 h-12 text-center border rounded-md text-lg font-semibold",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            )}
            {...props}
          />
        ))}
      </div>
    );
  }
);

InputOTP.displayName = "InputOTP";

// Remove these exports as we're not using them anymore
export const InputOTPGroup = InputOTP;
export const InputOTPSlot = InputOTP;
