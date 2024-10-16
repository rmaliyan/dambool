declare module "*.svg" {
    import type { StaticImageData } from "next/image";
  
    const content: StaticImageData;
    export default content;
  }

// declare module '*.svg' {
//   const content: string;
//   export default content;
// }