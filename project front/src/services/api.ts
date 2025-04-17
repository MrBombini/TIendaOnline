import { Product , Country } from '../types';

const API_URL = 'https://fakestoreapi.com';

// const API_URL = 'http://localhost:3000/api/products';
const URL = 'http://localhost:3000';

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getCountries(): Promise<Country[]> {
  try {
    const response = await fetch(`http://localhost:3000/countries`, {
      method: 'POST', // <- IMPORTANTE
    });
    if (!response.ok) throw new Error('Failed to fetch countries');
    return await response.json();
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}
