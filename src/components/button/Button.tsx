import React from "react";
import styles from "./Button.module.css";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  colorText?: string;
  bg?: string;
  fontSize?: string;
  opacity?: number;
  transform?: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  colorText,
  bg,
  fontSize,
  opacity = 1,
  transform,
  className,
  disabled,
  children,
  ...rest
}) => {
  return (
    <button
      className={`${styles.button} ${className ?? ""}`}
      style={{
        color: disabled ? "#999" : colorText,
        background: disabled ? "#eee" : bg,
        fontSize,
        opacity,
        transform,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
