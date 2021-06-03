declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  export default ComponentOptions
}

declare module '*.scss' {
  interface CSSModule {
    /** Returns the specific selector from imported stylesheet as string. */
    [key: string]: string
  }
  /** An SCSS based CSS module. https://sass-lang.com */
  const styles: CSSModule
  export default styles
}
