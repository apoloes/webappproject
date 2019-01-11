var root_url = "http://comp426.cs.unc.edu:3001/";
var username = '';

$(document).ready(() => {
    var seatIdList = [];
    var airportList = [];
    var coordinates = [];
    var labels = [];
    var names = [];
    var description = [];
    var current_airport = '';
    var inbound_airport = '';
    var outbound_airport = '';
    var current_airport_data = [];
    var inboundList = [];
    var outboundList = [];

    $('#login_btn').on('click', () => {
	
		let user = $('#user').val();
		let pass = $('#pass').val();
        
	    $.ajax(root_url + 'sessions',
	    {
	        type: 'POST',
	        xhrFields: {withCredentials: true},
	        data: {
	            "user": {
	                "username": user,
	                "password": pass
	            }
	        },

	        success: () => {
                username = user;
	        	home();
	            $.ajax(root_url + 'airports',
	            {
	                type: 'GET',
	                dataType: 'json',
	                xhrFields: {withCredentials: true},
	                success: (response) => {
	                    for (i=0;i<response.length;i++) {
	                        airportList.push(response[i].name);
	                    }
	                }
	            });
	        },
	        error: () => {
	       		$('#msg_div').html("Login failed. Try again");
	        }
	    });
	});
    
    
      
     function buildHomeMap() {
     	map = new google.maps.Map(document.getElementById('map'), {
     	    zoom: 3,
            center: {lat: 39.833333, lng: -98.583333},   
        });
       
        var markers = loc().map(function(location, i) {
            var infowindow = new google.maps.InfoWindow({
                content: description[i]
            });
            var marker = new google.maps.Marker({
                position: location,
                title: names[i],
                label: {
                    text: labels[i],
                    fontSize: "9px",
                },
            });
            var mapOptions = {
                styles: [
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{color: '#b9d8ff'}]
                },]
            }
            map.setOptions(mapOptions);
            marker.addListener('click', function() {
                infowindow.open(map, marker);
                document.getElementById("searchtext").value = marker.title;
            });
        
            return marker; 
        });
        var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    } 
      
    function buildFlightMap() {
    	var location = {lat: parseFloat(current_airport_data[0][0].latitude), lng: parseFloat(current_airport_data[0][0].longitude)};
        var flightMap = new google.maps.Map(document.getElementById('flightMap'), {
            zoom: 5,
            center: location,    
        });
   
    var marker = new google.maps.Marker({
        position: location,
        title: current_airport,
        label: {
            text: current_airport_data[0][0].code,
            fontSize: "9px",
        },
    });
    marker.setMap(flightMap);

        var mapOptions = {
            styles: [
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{color: '#b9d8ff'}]
                },]
        }
        flightMap.setOptions(mapOptions);

       	setMarkers(flightMap);
    }

    function setMarkers(map){
        var lineSymbol = {
            path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
        };


        if(inboundList.length > 0){
            for(var i = 0; i < outboundList.length; i++){
                var location = {lat: parseFloat(outboundList[i].latitude), lng: parseFloat(outboundList[i].longitude)};
                var marker = new google.maps.Marker({
                    content: description,
                    map: map,
                    title: outboundList[i].name,
                    label: {
                    text: outboundList[i].code,
                    fontSize: "9px",
                    },
                }); 
                var description = '<div id="content">'+
                    '<div id="siteNotice">'+
                    '</div>'+
                    '<h2 id="firstHeading" class="firstHeading">' + outboundList[i].name + ' (' + outboundList[i].code +')</h2>'+
                    '<div id="bodyContent">'+
                    '<b>Latitute: </b>' + outboundList[i].latitude + '<br>' + 
                    '<b>Longitude: </b>' + outboundList[i].longitude + '<br>' +
                    '<b>City: </b>' + outboundList[i].city + '<br>' +
                    '</div>'+
                    '</div>';
                var infowindow = new google.maps.InfoWindow({
                    content: description
                });	
                marker.addListener('click', function() {
                    infowindow.open(map, marker);
                });
            }
        }

    if(inboundList.length > 0){
        for(var i = 0; i < inboundList.length; i++){
            var location = {lat: parseFloat(inboundList[i].latitude), lng: parseFloat(inboundList[i].longitude)};
            var marker = new google.maps.Marker({
            position: location,
            map: map,
            title: inboundList[i].name,
            label: {
                text: inboundList[i].code,
                fontSize: "9px",
            },
            }); 
            var description = '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h2 id="firstHeading" class="firstHeading">' + inboundList[i].name + ' (' + inboundList[i].code +')</h2>'+
                '<div id="bodyContent">'+
                '<b>Latitute: </b>' + inboundList[i].latitude + '<br>' + 
                '<b>Longitude: </b>' + inboundList[i].longitude + '<br>' +
                '<b>City: </b>' + inboundList[i].city + '<br>' +
                '</div>'+
                '</div>';
            var infowindow = new google.maps.InfoWindow({
            content: description
            });	
            marker.addListener('click', function() {
            infowindow.open(map, marker);
            });
        }
    }    
}
var loc = function(){
      
    $.ajax(root_url + 'airports',
      {
        type: 'GET',
        async: false,
        dataType: 'json',
        xhrFields: {withCredentials: true},
        success: (response) => {
          for(i=0;i<response.length;i++) {
            coordinates.push({lat: parseFloat(response[i].latitude), lng: parseFloat(response[i].longitude)});
            labels.push(response[i].code);
            names.push(response[i].name); 
            description.push('<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h2 id="firstHeading" class="firstHeading">' + response[i].name + ' (' + response[i].code +')</h2>'+
        '<div id="bodyContent">'+
        '<b>Latitute: </b>' + response[i].latitude + '<br>' + 
        '<b>Longitude: </b>' + response[i].longitude + '<br>' +
        '<b>City: </b>' + response[i].city + '<br>' +
        '</div>'+
        '</div>'

              );
          }
        }
    });
    return coordinates;
}

function setStyle(){
    var mapOptions = {
        styles: [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
        },
        {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{color: '#263c3f'}]
        },
        {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#6b9a76'}]
        },
        {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#38414e'}]
        },
        {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{color: '#212a37'}]
        },
        {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9ca5b3'}]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#746855'}]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{color: '#1f2835'}]
        },
        {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{color: '#f3d19c'}]
        },
        {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{color: '#2f3948'}]
        },
        {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{color: '#17263c'}]
        },
        {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#515c6d'}]
        },
        {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{color: '#17263c'}]
        }
        ]
    }
    map.setOptions(mapOptions);
}

    //BUILD SEARCH PAGE
    var home = function(){
        $(".logo").click(function() {
            home();
        });

        $('.login-interface').empty();
        let homeheader = $('.homeheader');
        homeheader.empty();
        homeheader.append("Welcome " + username + "!");
        homeheader.append('<div id="logout"><a href="javascript:logout()">Logout</a></div>');
        homeheader.append('<div id="changepass"><a href="javascript:build_changepass_interface()">Change Password</a></div>');

        
        let body = $('.content');
        body.empty();
        body.append('<div id="search-area"><h1 class="center">Airport Search</h1>' +
        '<input type="text" placeholder = "Enter an airport name" id = "searchtext">' +
        '<button id = "search">Search</button></div>');
        body.append('<div id="create-area"><h1 class="center">Create</h1>' +
        '<button id = "airport">Airport</button></div>'+
        '<button id = "airplane">Airplane</button></div>');
    };

    //CREATE, BUILD AIRPORT()
    $("body").on( "click", "#airport", function() {
        build_airportcreation_interface();
    });
    //CREATE, BUILD PLANE()
    $("body").on("click", "#airplane", function() {
        build_planecreation_interface();
    });
    //SEARCH, BUILD RESULTS()
    $("body").on( "click", "#search", function() {
        $.ajax(root_url + 'airports?filter[name]=' + $("#searchtext").val(),
        {
            type: 'GET',
            dataType: 'json',
            xhrFields: {withCredentials: true},
            success: (response) => {
                results();
            }
        });     
    });

    //CLICK ON FLIGHT ID, SHOW INSTANCES
    $("body").on( "click", "#flight", function() {
        var flightid = $(this)[0].innerHTML;
        $.ajax(root_url + 'instances?filter[flight_id]=' + flightid,
        {
            type: 'GET',
            dataType: 'json',
            xhrFields: {withCredentials: true},
            success: (response) => {
                if($(this).parent().parent().parent().attr('id') == 'inbound') {
                    inbound_airport = $(this).next().text();
                } else {
                    outbound_airport = $(this).next().text();
                }
                flight_instance(response);
            }
        });
    });

    //CLICK ON FLIGHT ID, SHOW TICKETS
    $("body").on( "click", "#instance", function() {
        build_instance($(this).text());
    });

    //BUILD ADD TICKET
    $("body").on( "click", ".ticket-btn", function() {
        var instance_id = $(this).attr('id');

        if(seatIdList.length == 0) {
            $.ajax(root_url + 'instances/' + instance_id,
            {
                type: 'GET',
                dataType: 'json',
                xhrFields: {withCredentials: true},
                success: (response) => {
                    $.ajax(root_url + 'flights/' + response.flight_id,
                    {
                        type: 'GET',
                        dataType: 'json',
                        async: false,
                        xhrFields: {withCredentials: true},
                        success: (response) => {
                            $.ajax(root_url + 'seats?[filter[plane_id]=' + response.plane_id,
                            {
                                type: 'GET',
                                dataType: 'json',
                                async: false,
                                xhrFields: {withCredentials: true},
                                success: (response) => {
                                    for (i=0;i<response.length;i++) {
                                        seatIdList.push((response[i].id).toString());
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
        build_add_ticket(instance_id);
    });

    //ADD TICKET IMPLEMENTATION
    $("body").on( "click", "#add-ticket", function() {
        var fname = $("#first_name").val();
        var mname = $("#middle_name").val();
        var lname = $("#last_name").val();
        var age = $("#age").val();
        var gender = $("#gender").val();
        var seat_id = $('#seat_id').val();
        var instance_id = $("#seat-taken").prev().attr('id');
        
        if(fname.length == 0 || lname.lname == 0 || age.length == 0 || seat_id.length == 0) {
            alert("Missing fields");
        } else {
            $.ajax(root_url + 'tickets?filter[seat_id]=' + seat_id + '&filter[instance_id]=' + instance_id,
            {
                type: 'GET',
                dataType: 'json',
                xhrFields: {withCredentials: true},
                success: (response) => {
                    if(response.length == 0) {
                        $.ajax(root_url + 'tickets',
                        {
                            type: 'POST',
                            xhrFields: {withCredentials: true},
                            data: {
                                "ticket": {
                                    "first_name":   fname,
                                    "middle_name":  mname,
                                    "last_name":    lname,
                                    "age":          age,
                                    "gender":       gender,
                                    "is_purchased": true,
                                    "price_paid":   "290.11",
                                    "instance_id":  instance_id,
                                    "seat_id":      seat_id
                                }
                            },
                            success: (response) => {
                                build_instance(instance_id);
                            },
                        });
                    } else {
                        $("#seat-taken").text("Seat not available");
                    }
                }
            }); 
        }
    });

    $("body").on("change", "#seat_id", function() {
        var seat_id = $('#seat_id').val();

        if(seat_id.length != 0) {
            $.ajax(root_url + 'tickets?filter[seat_id]=' + seat_id,
            {
                type: 'GET',
                dataType: 'json',
                xhrFields: {withCredentials: true},
                success: (response) => {
                    $.ajax(root_url + 'seats/' + seat_id,{
                        type: 'GET',
                        dataType: 'json',
                        xhrFields: {withCredentials: true},
                        success: (response) => {
                            $('#seat-info').text('Seat: ' + response.row + response.number);
                        }   
                    });
                }
            });
        }  
    });


    //AIRPORT SEARCH AUTOCOMPLETE
    $("body").on( "keydown.autocomplete", "#searchtext", function() {
        $(this).autocomplete({
            source: airportList
        });
        $(".ui-helper-hidden-accessible").remove();
    });

    //SEAT ID AUTOCOMPLETE
    $("body").on( "keydown.autocomplete", "#seat_id", function() {
        $(this).autocomplete({
            source: seatIdList
        });
        $(".ui-helper-hidden-accessible").remove();

    });

    //SEARCH RESULTS PAGE
    var results = function(){
        current_airport = $("#searchtext").val()
        $.ajax(root_url + 'airports?filter[name]=' + current_airport,
        {
            type: 'GET',
            dataType: 'json',
            xhrFields: {withCredentials: true},
            success: (response) => {
           		current_airport_data.push(response)

                var airport = response[0].id;
                console.log(airport);
                $.ajax(root_url + 'flights?filter[arrival_id]=' + airport + '&filter[airline_id]=69511',
                {
                    type: 'GET',
                    dataType: 'json',
                    xhrFields: {withCredentials: true},
                    success: (response) => {
                        $('.content').empty();
                        $('.content').append('<h1>Airport Info</h1>');
                        $('.content').append('<div id="inbound-flights"><h2>Inbound Flights</h2>'+
                        '<table id = "inbound"><tr class = "header"><th>id</th><th>Departs From</th><th>Departure Time</th><th>Arrival Time</th></tr></table></div>');
                        for(let flight of response){
                            var temp = '<tr><th id = "flight">' + flight.id + '</th>'
                            $.ajax(root_url + 'airports/' + flight.departure_id,
                            {
                                type: 'GET',
                                async: false,
                                dataType: 'json',
                                xhrFields: {withCredentials: true},
                                success: (response) => {
                                    inboundList.push(response);
                                    temp += '<th>' + response.name + '</th>';
                                }
                            });
                            temp += '<th>' + flight.departs_at.toString().substring(11,16) + '</th><th>' + flight.arrives_at.toString().substring(11,16) + '</th></tr>';
                            $('#inbound').append(temp);
                        }
                       
                    }
                });
                $.ajax(root_url + 'flights?filter[departure_id]=' + airport + '&filter[airline_id]=69511',
                {
                    type: 'GET',
                    dataType: 'json',
                    xhrFields: {withCredentials: true},
                    success: (response) => {
                        $('.content').append('<div id="outbound-flights"><h2>Outbound Flights</h2>'+
                        '<table id = "outbound"><tr class = "header"><th>id</th><th>Arrives At</th><th>Departure Time</th><th>Arrival Time</th></tr></table></div>');
                        for(let flight of response){
                            var temp = '<tr><th id = "flight">' + flight.id + '</th>'
                            $.ajax(root_url + 'airports/' + flight.arrival_id,
                            {
                                type: 'GET',
                                async: false,
                                dataType: 'json',
                                xhrFields: {withCredentials: true},
                                success: (response) => {
                                    outboundList.push(response);
                                    temp += '<th>' + response.name + '</th>';
                                }
                            });
                            temp += '<th>' + flight.departs_at.toString().substring(11,16) + '</th><th>' + flight.arrives_at.toString().substring(11,16) + '</th></tr>';
                            $('#outbound').append(temp); 
                        }
                    $('.content').append('<div id="flightMap"></div>');
                    buildFlightMap();
                    }
                });
            }
        });
    };

    //FLIGHT INSTANCES PAGE
    var flight_instance = function(instances){
        let body = $('.content');
        body.empty();
        
        
        
        if(inbound_airport.length != 0) {
            body.append('<h2>'+ inbound_airport +' to ' + current_airport + '</h2>');
        } else {
            body.append('<h2>'+ current_airport +' to ' + outbound_airport + '</h2>');
        }


        body.append('<table id = "instances"><tr class = "header"><th>id</th><th>Date</th><th>Cancelled</th></tr></table>');
        for(instance of instances){
            temp = '<tr><th id="instance">' + instance.id + '</th>' +
                '<th id="date">' + instance.date + '</th>,/tr>' + 
                '<th id="cancelled">' + check(instance.is_cancelled) + '</th></tr>';

            $("#instances").append(temp);
        }
    
    }

    function check(cancelled) {
        if(cancelled) {return 'Yes';} else {return "No"};
    }

    //DISPLAY SPECIFIC INSTANCE
    var build_instance = function(id){
        var total_seats;
        var tickets;
        var available_seats;
        var seatmap;
        $.ajax(root_url + 'tickets?filter[instance_id]=' + id,
        {
            type: 'GET',
            dataType: 'json',
            async: false,
            xhrFields: {withCredentials: true},
            success: (response) => {
                tickets = response.length;
            }
        });
        $.ajax(root_url + 'instances/' + id,
        {
            type: 'GET',
            dataType: 'json',
            xhrFields: {withCredentials: true},
            success: (response) => {
                $('.content').empty();
                $(".content").append('<h1>FLIGHT ' + id + '</h1>');
                $.ajax(root_url + 'flights/' + response.flight_id,
                {
                    type: 'GET',
                    dataType: 'json',
                    async: false,
                    xhrFields: {withCredentials: true},
                    success: (response) => {
                        $.ajax(root_url + 'planes/' + response.plane_id,
                        {
                            type: 'GET',
                            dataType: 'json',
                            async: false,
                            xhrFields: {withCredentials: true},
                            success: (response) => {
                                seatmap = response.seatmap_url;
                            }
                        });
                        $.ajax(root_url + 'seats?filter[plane_id]=' + response.plane_id,
                        {
                            type: 'GET',
                            dataType: 'json',
                            async: false,
                            xhrFields: {withCredentials: true},
                            success: (response) => {
                                total_seats = response.length;
                                available_seats = total_seats - tickets;
                            }
                        });
                    }
                });
                $('.content').append('<table><tr><th id = "instanceinfo"><p>flight id: ' + response.flight_id + '</p><p>date: ' + response.date + '</p><p>cancelled: ' + response.is_cancelled + '</p><p>Total Seats: ' + total_seats + '</p><p>Tickets: ' + tickets + '</p><p>Remaining Seats: ' + available_seats + '</p><button class="ticket-btn" id="'+id+'">Add Ticket</button></th><th id = "instanceimage"><img src="' + seatmap + '"></th></tr></table>');            }
        });
    };

    //ADD TICKETS PAGE
    var build_add_ticket = function(instance_id) {
        $('.content').empty();
        $(".content").append('<h1 id='+instance_id+'>FLIGHT ' + instance_id + '</h1>');
        $('.content').append('<div id="seat-taken"></div>' +
                '<div>Seat ID*:<br><input type="text" id="seat_id"></div><div id="seat-info"></div>' +
                '<div>First name*:<br><input type="text" id="first_name"></div>' +
                '<div>Middle name:<br><input type="text" id="middle_name"></div>'+
                '<div>Last name*:<br><input type="text" id="last_name"></div>' +
                '<div>Age*:<br><input min="0" max="120" type="number" id="age"><div>'+
                '<div>Gender*:<br><select id="gender"><option value="male">Male</option>'+
                '<option value="female">Female</option><option value="other">Other</option></select></div>'+
                '<div><button id="add-ticket">Submit</button><div>'+
                '<p>*Required</p>');
    }

    //CREATE AIRPLANE IMPLEMENTATION
    $("body").on("click", "#create-airplane", function() {
        var airplane_name = $("#airplane_name").val();

        $.ajax(root_url + 'planes', {
            type: 'POST',
            xhrFields: { withCredentials: true },
            data: {
                "plane": {
                    "name": airplane_name,
                    "seatmap_url": "https://cdn.seatguru.com/en_US/img/20181116212442/seatguru/airlines_new/Delta_Airlines/Delta_Airlines_MD-90.svg",
                    "airline_id": 69511
                }
            },
            success: () => {
                home();
            }
        })
    });
    
    //CREATE AIRPORT IMPLEMENTATION
    $("body").on("click", "#create-airport", function() {
        var airport_name = $("#airport_name").val();
        var airport_code = $("#airport_code").val();

        $.ajax(root_url + 'airports', {
            type: 'POST',
            xhrFields: { withCredentials: true },
            data: {
                "airport": {
                    "name": airport_name,
                    "code": airport_code
                }
            },
            success: () => {
                home();
            }
        })
    });

    //CHANGE PASSWORD IMPLEMENTATION
    $("body").on( "click", "#change-pass", function() {
        var user1 = $("#username1").val();
        var old_pass = $("#old_pass").val();
        var new_pass = $("#new_pass").val();
        

        $.ajax(root_url + 'passwords',{
            type: 'PUT',
            xhrFields: { withCredentials: true },
            data: {
	            "user": {
	                "username": user1,
                    "old_password": old_pass,
                    "new_password": new_pass
	            }
	        },
            success: () => {
                window.location = 'project.html';
            },
            error: () => {
                $('.msg_div').empty();
                $('.msg_div').html("Username or old password is incorrect. Try again");                
            }

        });

    });
});

//LOGOUT
function logout() {
    $.ajax(root_url + 'sessions',{
        type: 'DELETE',
        xhrFields: { withCredentials: true },

        success: () => {
            console.log(username);
            window.location = 'project.html';
        }
      });
}

//AIRPORT CREATION INTERFACE
function build_airportcreation_interface() {
    let body = $('.content');
    body.empty();
    body.append('<h1>Create an airport instance</h1>');
    body.append(
                '<div>Airport name:<br><input type="text" id="airport_name"></div>' +
                '<div>Code (Ex: RDU):<br><input type="text" id="airport_code"></div>' +
                '<div ><button id="create-airport">Create</button><div>' +
                '<div class="msg_div"></div>');
}

//PLANE CREATION INTERFACE
function build_planecreation_interface() {
    let body = $('.content');
    body.empty();
    body.append('<h1>Create an airplane instance</h1>');
    body.append(
                '<div>Plane name:<br><input type="text" id="airplane_name"></div>' +
                '<div>Airline ID: 69511-DELTA</div>' +
                '<div ><button id="create-airplane">Create</button><div>' +
                '<div class="msg_div"></div>');
}

//CHANGE PASS INTERFACE
function build_changepass_interface() {
    
    let body = $('.content');
    body.empty();
    body.append('<h1>Change your password</h1>');
    body.append('<div id="seat-taken"></div>' +
                '<div>Username:<br><input type="text" id="username1"></div>' +
                '<div>Old password:<br><input type="password" id="old_pass"></div>' +
                '<div>New password:<br><input type="password" id="new_pass"></div>'+
                '<div ><button id="change-pass">Submit</button><div>' +
                '<div class="msg_div"></div>');    
}