"use client";

import { useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface AdminSuccessAlertProps {
  title?: string;
  text?: string;
  icon?: "success" | "error" | "warning" | "info" | "question";
}

export default function AdminSuccessAlert({
  title,
  text,
  icon = "success",
}: AdminSuccessAlertProps) {
  useEffect(() => {
    if (!title && !text) return;

    MySwal.fire({
      title: title || "Done",
      text: text || "",
      icon,
      confirmButtonColor: "#0891b2",
      confirmButtonText: "OK",
    });
  }, [title, text, icon]);

  return null;
}