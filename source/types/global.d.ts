import type { ReactNode } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module "sonner" {
  export const toast: {
    success: (message: string) => void;
    error: (message: string, options?: { description?: string }) => void;
  };
}

declare module "framer-motion" {
  export const motion: {
    div: React.FC<{
      children?: ReactNode;
      className?: string;
      initial?: any;
      animate?: any;
      transition?: any;
    }>;
  };
}

declare module "lucide-react" {
  interface IconProps {
    className?: string;
    size?: number | string;
  }

  export const Loader2: React.FC<IconProps>;
  export const AlertCircle: React.FC<IconProps>;
  export const CheckCircle2: React.FC<IconProps>;
  export const Shield: React.FC<IconProps>;
  export const User: React.FC<IconProps>;
  export const Key: React.FC<IconProps>;
  export const ArrowRight: React.FC<IconProps>;
}

export {};
