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
        const {id} = conversation.properties();
        const url = 'https://atapi2.postnord.com/rest/shipment/v1/trackandtrace/findByIdentifier.json?apikey=9f7708e8b2a1b519946c7cdebff6a0c5&id=' + id + '&locale=en';
        request(url, function (error, res, body) {
            let json = JSON.parse(body);
            let shipmentInfo = json.TrackingInformationResponse.shipments[0];
            if (shipmentInfo) {
                let date = new Date(shipmentInfo.deliveryDate);
                conversation.variable("date", date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear());
                conversation.variable("time", date.getHours() + ':' + date.getMinutes());
                conversation.transition("success");
            } else {
                conversation.transition("error");
            }
            done();
        });
    }
};