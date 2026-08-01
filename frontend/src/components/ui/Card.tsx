import React, { HTMLAttributes } from "react";
import "./Card.css";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "neutral" | "accent" | "floating";
}

export default function Card({
  children,
  variant = "neutral",
  className = "",
  ...props
}: CardProps) {
  return (
    <div className={`card card-${variant} ${className}`} {...props}>
      {children}
    </div>
  );
}
