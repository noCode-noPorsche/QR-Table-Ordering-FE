"use client";

import { Input } from "@/src/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export type IPasswordFieldProps = React.ComponentProps<"input">;

export function PasswordField({ className, ...props }: IPasswordFieldProps) {
  const [inputType, setInputType] = useState("password");

  const handleInputTypeChange = () => {
    setInputType((prev) => (prev === "password" ? "text" : "password"));
  };

  return (
    <div className="relative">
      <Input {...props} type={inputType} className={className} />
      <div
        onClick={handleInputTypeChange}
        className="w-fit cursor-pointer absolute top-1/2 right-3 -translate-y-1/2"
      >
        {inputType === "password" ? <EyeOff size={20} /> : <Eye size={20} />}
      </div>
    </div>
  );
}
