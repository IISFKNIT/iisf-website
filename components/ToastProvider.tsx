"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#fff",
          color: "#1E293B",
          padding: "16px",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          fontSize: "14px",
          fontWeight: 500,
        },
        success: {
          duration: 3000,
          style: {
            background: "#ECFDF5",
            color: "#065F46",
            border: "1px solid #A7F3D0",
          },
          iconTheme: {
            primary: "#10B981",
            secondary: "#ECFDF5",
          },
        },
        error: {
          duration: 5000,
          style: {
            background: "#FEF2F2",
            color: "#991B1B",
            border: "1px solid #FECACA",
          },
          iconTheme: {
            primary: "#EF4444",
            secondary: "#FEF2F2",
          },
        },
        loading: {
          style: {
            background: "#EFF6FF",
            color: "#1E40AF",
            border: "1px solid #BFDBFE",
          },
        },
      }}
    />
  );
}
