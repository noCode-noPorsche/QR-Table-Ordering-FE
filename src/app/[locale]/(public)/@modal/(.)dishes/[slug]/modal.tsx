"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "@/i18n/navigation";
import React, { useState } from "react";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setTimeout(() => {
            router.back();
          }, 300);
        }
      }}
    >
      <DialogContent
        className="
          /* 1. Kích thước và giới hạn diện tích hiển thị */
          w-[calc(100%-2rem)] max-w-2xl md:max-w-3xl lg:max-w-4xl
          max-h-[90vh] md:max-h-[85vh] flex flex-col
          
          /* 2. Thiết kế viền, bo góc và đổ bóng cao cấp */
          p-0 overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800
          bg-white/95 dark:bg-slate-950/95 backdrop-blur-md
          shadow-2xl shadow-slate-200/50 dark:shadow-none
          
          /* 3. Hiệu ứng mượt mà khi đóng mở */
          transition-all duration-300 ease-out
          
          /* 4. Định vị canh giữa */
          fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]
        "
      >
        <div className="px-6 pt-6">
          <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Chi tiết món ăn
          </DialogTitle>
        </div>
        {/* Box chứa nội dung có scroll tự động và giấu thanh scroll gốc */}
        <div className="w-full h-full max-h-[90vh] md:max-h-[85vh] overflow-auto p-5 md:p-6 lg:p-8 scrollbar-thin">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
