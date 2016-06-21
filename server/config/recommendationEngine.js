var q = require('q');
var net = require('net');

module.exports = function(host, port){
	/**
	 * {
	 * 		req_type : TITLE / WHAT,
	 * 		messageId : generated message id for tracking request,
	 * 		userId : user id (id from mongo),
	 * 		text : text content,
	 * 		tags : [array of tags (strings)]
	 * }
	 */
	 return {

	 	getRecommendations: function (req) {
	 		console.log("engine: got the title: " + req.text);
	 		// var that = this;
	 		// var gotReq = req;
	        //var emp = "";
	        var defer = q.defer();
	        var client;
	        if (!req) {
	        	defer.reject('Please specify the url to receive data');
	        } else {
	        	client = new net.Socket();
	        	client.connect(port, host, function() {
	        		// var req = that.gotReq;
	        		console.log('CONNECTED TO recommending engine on: ' + host + ':' + port);
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
	    			console.log('sending req: ' + fullReq);
	    			client.write(fullReq);

	    		});


	            // Add a 'data' event handler for the client socket
				// data is what the server sent to this socket
				client.on('data', function(data) {
					console.log('got from recommendation engine: ' + data);

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
};

/*
                                                                                                              
                                                                                                              
FFFFFFFFFFFFFFFFFFFFFF                                      kkkkkkkk                UUUUUUUU     UUUUUUUU     
F::::::::::::::::::::F                                      k::::::k                U::::::U     U::::::U     
F::::::::::::::::::::F                                      k::::::k                U::::::U     U::::::U     
FF::::::FFFFFFFFF::::F                                      k::::::k                UU:::::U     U:::::UU     
  F:::::F       FFFFFFuuuuuu    uuuuuu      cccccccccccccccc k:::::k    kkkkkkk      U:::::U     U:::::U      
  F:::::F             u::::u    u::::u    cc:::::::::::::::c k:::::k   k:::::k       U:::::D     D:::::U      
  F::::::FFFFFFFFFF   u::::u    u::::u   c:::::::::::::::::c k:::::k  k:::::k        U:::::D     D:::::U      
  F:::::::::::::::F   u::::u    u::::u  c:::::::cccccc:::::c k:::::k k:::::k         U:::::D     D:::::U      
  F:::::::::::::::F   u::::u    u::::u  c::::::c     ccccccc k::::::k:::::k          U:::::D     D:::::U      
  F::::::FFFFFFFFFF   u::::u    u::::u  c:::::c              k:::::::::::k           U:::::D     D:::::U      
  F:::::F             u::::u    u::::u  c:::::c              k:::::::::::k           U:::::D     D:::::U      
  F:::::F             u:::::uuuu:::::u  c::::::c     ccccccc k::::::k:::::k          U::::::U   U::::::U      
FF:::::::FF           u:::::::::::::::uuc:::::::cccccc:::::ck::::::k k:::::k         U:::::::UUU:::::::U      
F::::::::FF            u:::::::::::::::u c:::::::::::::::::ck::::::k  k:::::k         UU:::::::::::::UU       
F::::::::FF             uu::::::::uu:::u  cc:::::::::::::::ck::::::k   k:::::k          UU:::::::::UU         
FFFFFFFFFFF               uuuuuuuu  uuuu    cccccccccccccccckkkkkkkk    kkkkkkk           UUUUUUUUU           
                                                                                                              
                                                                                                              
                                                                                                              
                                                                                                              
                                                                                                              
                                                                                                              
                                                                                                              
                                                                                                              
                                                                                                              
MMMMMMMM               MMMMMMMM  iiii  lllllll                                                                
M:::::::M             M:::::::M i::::i l:::::l                                                                
M::::::::M           M::::::::M  iiii  l:::::l                                                                
M:::::::::M         M:::::::::M        l:::::l                                                                
M::::::::::M       M::::::::::Miiiiiii  l::::lvvvvvvv           vvvvvvvuuuuuu    uuuuuu      ssssssssss       
M:::::::::::M     M:::::::::::Mi:::::i  l::::l v:::::v         v:::::v u::::u    u::::u    ss::::::::::s      
M:::::::M::::M   M::::M:::::::M i::::i  l::::l  v:::::v       v:::::v  u::::u    u::::u  ss:::::::::::::s     
M::::::M M::::M M::::M M::::::M i::::i  l::::l   v:::::v     v:::::v   u::::u    u::::u  s::::::ssss:::::s    
M::::::M  M::::M::::M  M::::::M i::::i  l::::l    v:::::v   v:::::v    u::::u    u::::u   s:::::s  ssssss     
M::::::M   M:::::::M   M::::::M i::::i  l::::l     v:::::v v:::::v     u::::u    u::::u     s::::::s          
M::::::M    M:::::M    M::::::M i::::i  l::::l      v:::::v:::::v      u::::u    u::::u        s::::::s       
M::::::M     MMMMM     M::::::M i::::i  l::::l       v:::::::::v       u:::::uuuu:::::u  ssssss   s:::::s     
M::::::M               M::::::Mi::::::il::::::l       v:::::::v        u:::::::::::::::uus:::::ssss::::::s    
M::::::M               M::::::Mi::::::il::::::l        v:::::v          u:::::::::::::::us::::::::::::::s     
M::::::M               M::::::Mi::::::il::::::l         v:::v            uu::::::::uu:::u s:::::::::::ss      
MMMMMMMM               MMMMMMMMiiiiiiiillllllll          vvv               uuuuuuuu  uuuu  sssssssssss        
                                                                                                              
                                                                                                              



*/


/*

var get_title_recommendations = function ( nMessageId, nUserId, nText, nTags){
	get_recommendations('TITLE', nMessageId, nUserId, nText, nTags);
}

var get_what_recommendations = function ( nMessageId, nUserId, nText, nTags){
	get_recommendations('WHAT', nMessageId, nUserId, nText, nTags);
}


var get_recommendations = function(req_type, nMessageId, nUserId, nText, nTags){
	var promise =

	var client = new net.Socket();
	client.connect(PORT, HOST, function() {

		console.log('CONNECTED TO: ' + HOST + ':' + PORT);

		var tags = '';
		for(var i = 0; i < nTags.length; i++){
			tags = tags + nTags[i] + ',';
		}

		if(tags.length > 0){
			tags = tags.substring(0, tags.length - 1);	
		}
		
		console.log(tags);

    	// Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    	var req = req_type + '_REC_REQ\nMessageId: ' + nMessageId + '\nUserId: ' + nUserId + '\nText:' + nText + '\nTags:' + tags + '\n@\n';
    	console.log(req);

    	client.write(req);

	});


	// Add a 'data' event handler for the client socket
	// data is what the server sent to this socket
	client.on('data', function(data) {

		var answer = JSON.parse(data);
    	// Close the client socket completely

    	// TODO - there can be security problems because we openning and closing connections in each request
    	// thus, main server can block the request from that source considering this requests as flooding attack.

    	client.destroy();
    	console.log("debriefs : " + answer['debriefs']);
	});

	// Add a 'close' event handler for the client socket
	client.on('close', function() {
		console.log('Connection closed');
	});

	function(){


	}();
}

get_title_recommendations(1,123,'Damaged hardware due to extreme heat', ['david', 'itzik'])

*/



	/*
	var kaki = function(one, callback){
		callback(50);
	}

	kaki(1, function(returnedNumber){
		if(returnedNumber){
			console("YAY");
		}
	});



	*/