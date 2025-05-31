export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  rating: number;
  reviews: number;
  stock: number;
  featured?: boolean;
  new?: boolean;
  details?: {
    dimensions?: string;
    weight?: string;
    materials?: string[];
    colors?: string[];
    features?: string[];
  };
}