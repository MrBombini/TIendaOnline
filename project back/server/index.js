import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'soap';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Sample product data
const products = [
  {
    id: 1,
    name: "Laptop Pro X",
    price: 1299.99,
    description: "High-performance laptop with latest specifications",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500",
    stock: 10
  },
  {
    id: 2,
    name: "Smartphone Ultra",
    price: 799.99,
    description: "Next-generation smartphone with advanced camera system",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    stock: 15
  },
  {
    id: 3,
    name: "Wireless Headphones",
    price: 199.99,
    description: "Premium wireless headphones with noise cancellation",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    stock: 20
  }
];

// Sample countries data
const countries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "MX", name: "Mexico" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" }
];

// REST API endpoints
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// SOAP service
const countriesService = {
  CountriesService: {
    CountriesPort: {
      GetCountries: function(args) {
        return {
          countries: countries
        };
      }
    }
  }
};

// SOAP XML schema
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<definitions name="CountriesService"
             targetNamespace="http://example.com/countries"
             xmlns="http://schemas.xmlsoap.org/wsdl/"
             xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
             xmlns:tns="http://example.com/countries"
             xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <types>
        <xsd:schema targetNamespace="http://example.com/countries">
            <xsd:complexType name="Country">
                <xsd:sequence>
                    <xsd:element name="code" type="xsd:string"/>
                    <xsd:element name="name" type="xsd:string"/>
                </xsd:sequence>
            </xsd:complexType>
            <xsd:complexType name="CountriesResponse">
                <xsd:sequence>
                    <xsd:element name="countries" type="tns:Country" maxOccurs="unbounded"/>
                </xsd:sequence>
            </xsd:complexType>
            <xsd:element name="GetCountriesRequest" type="xsd:string"/>
            <xsd:element name="GetCountriesResponse" type="tns:CountriesResponse"/>
        </xsd:schema>
    </types>
    <message name="GetCountriesInput">
        <part name="body" element="tns:GetCountriesRequest"/>
    </message>
    <message name="GetCountriesOutput">
        <part name="body" element="tns:GetCountriesResponse"/>
    </message>
    <portType name="CountriesPort">
        <operation name="GetCountries">
            <input message="tns:GetCountriesInput"/>
            <output message="tns:GetCountriesOutput"/>
        </operation>
    </portType>
    <binding name="CountriesBinding" type="tns:CountriesPort">
        <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
        <operation name="GetCountries">
            <soap:operation soapAction="http://example.com/GetCountries"/>
            <input>
                <soap:body use="literal"/>
            </input>
            <output>
                <soap:body use="literal"/>
            </output>
        </operation>
    </binding>
    <service name="CountriesService">
        <port name="CountriesPort" binding="tns:CountriesBinding">
            <soap:address location="http://localhost:3000/soap"/>
        </port>
    </service>
</definitions>`;

// Create HTTP server
const server = createServer(app);

// Create SOAP server
const soapServer = new Server({
  CountriesService: countriesService,
  xml: xml
});

// Mount SOAP server
soapServer.listen(server, '/soap');

// Start server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`REST API: http://localhost:${port}/api/products`);
  console.log(`SOAP endpoint: http://localhost:${port}/soap`);
});