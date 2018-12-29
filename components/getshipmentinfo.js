'use strict';
var request = require('request');
module.exports = {
    metadata: () => ({
    name: 'ShipmentChecker',
    properties: {
        id: {
            required: true,
            type: 'string'
        },
    },
    supportedActions: ["success", "error"]
}),
    invoke: (conversation, done) => {
        const { id } = conversation.properties();
        const url='https://atapi2.postnord.com/rest/shipment/v1/trackandtrace/findByIdentifier.json?apikey=3c148d4769d841823f6942470675b2da&id='+id+'&locale=en';
        request(url, function(error, res, body){
            var json = JSON.parse(body);
            var arrivalDate = json.TrackingInformationResponse.shipments.estimatedTimeOfArrival;
            if (arrivalDate) {
                let date = new Date(arrivalDate);
                conversation.variable("date",date.getDate());
                conversation.variable("time",date.getTime());
                conversation.transition("success");
            }else{
                conversation.reply("Seems like you entered an invalid shipment id, try again...").transition("error");
            }
            done();
        });
    }
};