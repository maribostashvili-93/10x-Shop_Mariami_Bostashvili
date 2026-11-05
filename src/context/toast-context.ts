import { createContext } from "react";

export type ToastTone = "success" | "info" | "error";

export type ToastContextValue = {
  /** Shows a short message that disappears automatically. */
  showToast: (message: string, tone?: ToastTone) => void;
};

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);
