const port = 3000;
import express = require('express');
import bodyParser = require('body-parser');
import soap = require('soap');
import {Client, ISoapMethod, WSDL} from "soap";
import axios from 'axios'

var url = 'http://www.holidaywebservice.com//HolidayService_v2/HolidayService2.asmx?wsdl';

export class Helper {
    startExpressServer(): void {
        let app: express.Application = express();
        const port: number = 3000;

        app.use(bodyParser.json()); // for parsing application/json

        app.post('/countries', function (req, res) {
            console.log("\n * Request received from SOAP client. *");
            res.send(req.body);
        });

        app.listen(port, () => this.soapGet());
    }

    soapGet(): void {
        var args = {name: 'value'};

        soap.createClient(url, function (err: any, client: Client) {
            // @ts-ignore
            client.GetCountriesAvailable(args, function (err: any, result: any) {
                let countries = result.GetCountriesAvailableResult.CountryCode;

                console.log("\n * Response received from SOAP server. * ");

                axios.post('http://localhost:3000/countries', countries)
                    .then(response => {
                        console.log("\n Response :  \n");
                        console.log(response.data);
                        process.exit();
                    })
                    .catch(error => {
                        console.log(error);
                    });
            });
        });
    }
}


