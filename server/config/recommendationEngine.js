var q = require('q');
var net = require('net');

var RECOMMENDATION_HOST = '127.0.0.1';
var RECOMMENDATION_PORT = 5000;

module.exports = {
    getRecommendations: function (req) {
        // console.log("engine: got the title: " + req.text);
        // var that = this;
        // var gotReq = req;
        //var emp = "";
        var defer = q.defer();
        var client;
        if (!req) {
            defer.reject('Please specify the url to receive data');
        } else {
            client = new net.Socket();
            client.connect(RECOMMENDATION_PORT, RECOMMENDATION_HOST, function() {
                // var req = that.gotReq;
                console.log('CONNECTED TO recommending engine on: ' + RECOMMENDATION_HOST + ':' + RECOMMENDATION_PORT);
                var req_type = req.req_type;
                var nMessageId = req.messageId;
                var nUserId = req.userId;
                var nText = req.text;
                var nTags = req.tags;

                var tags = '';
                for(var i = 0; i < nTags.length; i++){
                    tags = tags + nTags[i] + ',';
                }
                if(tags.length > 0){
                    tags = tags.substring(0, tags.length - 1);
                }
                // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
                var fullReq = req_type + '_REC_REQ\nMessageId: ' + nMessageId + '\nUserId: ' + nUserId + '\nText:' + nText + '\nTags:' + tags + '\n@\n';
                // console.log('sending req: ' + fullReq);
                client.write(fullReq);

            });


            // Add a 'data' event handler for the client socket
            // data is what the server sent to this socket
            client.on('data', function(data) {
                // console.log('got from recommendation engine: ' + data);

                try {
                    var receivedJson = JSON.parse(data);
                    defer.resolve(receivedJson);
                } catch (error) {
                    defer.reject(error);
                }

                // TODO - there can be security problems because we openning and closing connections in each request
                // thus, main server can block the request from that source considering this requests as flooding attack.
                client.destroy();
                // Close the client socket completely
            });

            // Add a 'close' event handler for the client socket
            client.on('close', function() {
                console.log('Connection closed');
            });
        }
        return defer.promise;
    }
};