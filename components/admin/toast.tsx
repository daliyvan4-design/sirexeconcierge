"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2 } from "lucide-react";

interface ToastContextValue {
  show: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ show: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const show = useCallback((msg: string) => {
    setMessage(msg);
    setVisible(true);
    setTimeout(() => setVisible(false), 1800);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-cream px-4 py-3 rounded-xl shadow-float flex items-center gap-2.5 text-[13px] z-[80] transition-all duration-250 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"
        }`}
      >
        <CheckCircle2 size={16} className="text-ok" />
        {message}
      </div>
    </ToastContext.Provider>
  );
}
