// this is the types shared in the project

export interface Package {
  name: string;
  price: number;
  invoiceDate: string;
  status: string;
}

export interface Chat {
  avatar: string;
  name: string;
  text: string;
  time: number;
  textCount: number;
  dot: number;
}

export interface Lead {
  avatar: string;
  name: string;
  email: string;
  project: string;
  duration: number;
  status: string;
}

export type Country = {
  name: string;
  flag: string;
  percentage: number;
};

export interface CardItemProps {
  imageSrc: string;
  name: string;
  role: string;
  cardImageSrc: string;
  cardTitle: string;
  cardContent: string;
}
