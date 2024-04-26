import '@emotion/react';
import { CSSObject, SerializedStyles } from '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {}
}

declare module 'react' {
  interface Attributes {
    css?: CSSObject | SerializedStyles | (CSSObject | SerializedStyles)[];
  }
}