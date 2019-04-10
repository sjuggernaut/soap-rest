const port = 3000;

module.exports = {
    /* Code for REST SERVER */
    startExpressServer: function () {
        let express = require('express');
        const bodyParser = require('body-parser');
        const app = express();

        app.use(bodyParser.json()); // for parsing application/json

        app.post('/countries', function (req, res) {
            console.log("\n * Request received from SOAP client. *");
            res.send(req.body);
        });

        app.listen(port, () => this.soapGet());
    },

    soapGet: function () {
        var soap = require('soap');
        var axios = require('axios');
        var url = 'http://www.holidaywebservice.com//HolidayService_v2/HolidayService2.asmx?wsdl';
        var args = {name: 'value'};

        soap.createClient(url, function (err, client) {
            client.GetCountriesAvailable(args, function (err, result) {
                countries = result.GetCountriesAvailableResult.CountryCode;

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

};
