export interface FAQ {
  header: string;
  id: number;
  text: string;
}

export interface FaqItem {
  active: number | null;
  handleToggle: (index: number) => void;
  faq: FAQ;
}
