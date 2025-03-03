import { ButtonProps } from "@/components/ui/button";
import { ReactNode } from "react";

export type Dialog<T = any> = {
  isAlert?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  title?: string | ReactNode;
  titleClassName?: string;
  description?: string | ReactNode;
  descriptionClassName?: string;
  children?: ReactNode | ((...args: any) => ReactNode);
  className?: string;
  cancel?: ButtonProps & {
    label?: string;
    onClick?: () => void;
  };
  action?: ButtonProps & {
    label?: string;
    onClick?: () => void;
  };
  onClose?: () => void;
};
