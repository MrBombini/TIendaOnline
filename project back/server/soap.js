const express = require('express');
const fetch = require('node-fetch'); // Asegúrate de instalarlo si no lo tienes
const { XMLParser } = require('fast-xml-parser'); // npm i fast-xml-parser

const router = express.Router();

router.post('/', async (req, res) => {
  const soapRequest = `
    <?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope
      xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
      xmlns:web="http://www.oorsprong.org/websamples.countryinfo">
      <soap:Body>
        <web:ListOfCountryNamesByCode/>
      </soap:Body>
    </soap:Envelope>
  `;

  try {
    const response = await fetch('http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': 'http://www.oorsprong.org/websamples.countryinfo/CountryInfoService.wso/ListOfCountryNamesByCode'
      },
      body: soapRequest
    });

    const xml = await response.text();
    console.log('XML Response:', xml);

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
      ignoreDeclaration: true,
      processEntities: true,
      preserveOrder: false
    });

    // // Parsear XML a JSON
    // const parser = new XMLParser();
    const parsed = parser.parse(xml);
    console.log(parsed);

    const countryList =
      parsed['soap:Envelope']['soap:Body']?.['m:ListOfCountryNamesByCodeResponse']?.['m:ListOfCountryNamesByCodeResult']?.['m:tCountryCodeAndName'] || [];

    // Convertimos al formato deseado
    const countries = Array.isArray(countryList)
      ? countryList.map(c => ({
          code: c['m:sISOCode'],
          name: c['m:sName']
        }))
      : [];
    res.json(countries);
    console.log(countries);
  } catch (err) {
    console.error('Error fetching or parsing SOAP response:', err);
    
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});


module.exports = router;
