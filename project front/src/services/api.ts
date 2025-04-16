import { Product , Country } from '../types';

const API_URL = 'https://fakestoreapi.com/products';
const SOAP_URL = 'http://localhost:3000/soap/countries';

// const API_URL = 'http://localhost:3000/api/products';
// const SOAP_URL = 'http://localhost:3000/soap/countries';

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
  const soapRequest = `
    <?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <GetCountries xmlns="http://example.com/countries"/>
      </soap:Body>
    </soap:Envelope>
  `;

  try {
    const response = await fetch(SOAP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': 'http://example.com/GetCountries'
      },
      body: soapRequest
    });

    if (!response.ok) throw new Error('Failed to fetch countries');
    
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    const countryNodes = xmlDoc.getElementsByTagName('Country');
    const countries: Country[] = Array.from(countryNodes).map(node => ({
      code: node.getElementsByTagName('code')[0].textContent || '',
      name: node.getElementsByTagName('name')[0].textContent || ''
    }));

    return countries;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}