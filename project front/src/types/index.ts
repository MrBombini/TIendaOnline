export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Country {
  code: string;
  name: string;
}

export interface CheckoutForm {
  fullName: string;
  email: string;
  address: string;
  country: string;
  city: string;
  zipCode: string;
}