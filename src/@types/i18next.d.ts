// import the original type declarations
import { defaultNS } from '~/i18n';
import Resources from './resources';

declare module 'i18next' {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: Resources;
  }
}
