/// <reference types="vite/client" />

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "react-loader-spinner" {
  import type { FC } from "react";
  interface DNAProps {
    visible?: boolean;
    height?: string | number;
    width?: string | number;
    ariaLabel?: string;
    wrapperStyle?: React.CSSProperties;
    wrapperClass?: string;
  }
  export const DNA: FC<DNAProps>;
}

