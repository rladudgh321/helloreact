export interface DataProps {
  id: number;
  date: string;
  images: string;
  tags: string;
  title: string;
}

export interface StringToArrayProps extends Omit<DataProps, 'images' | 'tags'> {
  images: string[];
  tags: string[];
}

export interface StringToArrayPropsWithoutImages extends Omit<DataProps, 'images' | 'tags'> {
  tags: string[];
}