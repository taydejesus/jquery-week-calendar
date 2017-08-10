  var CLIENT_ID = '1085272513665-952icm7bd2pfq8frcb0pgav6rr41u3vj.apps.googleusercontent.com';
      // Array of API discovery doc URLs for APIs used by the quickstart
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
var calFlag = false;
var calendarEvents = {
  events: []
};

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

      var authorizeButton = document.getElementById('authorize-button');
      var signoutButton = document.getElementById('signout-button');

      /**
       *  On load, called to load the auth2 library and API client library.
       */
      function handleClientLoad() {
        gapi.load('client:auth2', initClient);
      }

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
      function initClient() {
        gapi.client.init({
          discoveryDocs: DISCOVERY_DOCS,
          clientId: CLIENT_ID,
          scope: SCOPES
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
        });
      }

      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'inline-block';
          listUpcomingEvents();
        } else {
          authorizeButton.style.display = 'inline-block';
          signoutButton.style.display = 'none';
        }
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
      }

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }

      /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
      function listUpcomingEvents() {
        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        }).then(function(response) {
          var events = response.result.items;

         var year = new Date().getFullYear();
          var month = new Date().getMonth();
          var day = new Date().getDate();

          if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              var tempObject = {};
              var event = events[i];
              var summary = event.summary;
              var start = new Date(event.start.dateTime);
              var end = new Date(event.end.dateTime);
              var startTime = undefined;
              var endTime = undefined;
              if(!start) {
                start = event.start.date;
              } else {
               startTime = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), start.getMinutes())
               endTime = new Date(end.getFullYear(), end.getMonth(), end.getDate(), end.getHours(), end.getMinutes())
              }

              tempObject.id = i+1;
              tempObject.start = startTime;
              tempObject.end = endTime;
              tempObject.title = summary;
              calendarEvents.events.push(tempObject);

              console.log(summary);
              console.log(startTime);
              console.log(endTime);
              // appendPre(event.summary + ' (' + start + ')')
            }
          } else {
            appendPre('No upcoming events found.');
          }
          console.log(typeof(calendarEvents));
          console.log(calendarEvents);
          makeCal();
          dateHeaderClicks();
        });
      }
      function dateHeaderClicks() {
      	var dateHeader = document.getElementsByClassName("wc-day-column-header");
      	console.log('header len',dateHeader.length);
      	for (var i=0; i<dateHeader.length; i++) {
      		console.log('header i',dateHeader[i])
      		dateHeader[i].addEventListener('click', () => {
      			//console.log(event.target.nodeName);
      			console.log("Clicked")
      			//which day was clicked?
      			//search that day
      		});
      	}
      }

 function makeCal() {
      $('#calendar').weekCalendar({
        timeslotsPerHour: 6,
        timeslotHeigh: 30,
        hourLine: true,
        data: calendarEvents,
        height: function($calendar) {
          return $(window).height() - $('h1').outerHeight(true);
        },
        eventRender : function(calEvent, $event) {
          if (calEvent.end.getTime() < new Date().getTime()) {
            $event.css('backgroundColor', '#aaa');
            $event.find('.time').css({'backgroundColor': '#999', 'border':'1px solid #888'});
          }
        },
        eventNew: function(calEvent, $event) {
          displayMessage('<strong>Added event</strong><br/>Start: ' + calEvent.start + '<br/>End: ' + calEvent.end);
          // alert('You\'ve added a new event. You would capture this event, add the logic for creating a new event with your own fields, data and whatever backend persistence you require.');
        },
        eventDrop: function(calEvent, $event) {
          displayMessage('<strong>Moved Event</strong><br/>Start: ' + calEvent.start + '<br/>End: ' + calEvent.end);
        },
        eventResize: function(calEvent, $event) {
          displayMessage('<strong>Resized Event</strong><br/>Start: ' + calEvent.start + '<br/>End: ' + calEvent.end);
        },
        eventClick: function(calEvent, $event) {
          displayMessage('<strong>Clicked Event</strong><br/>Start: ' + calEvent.start + '<br/>End: ' + calEvent.end);
        },
        eventMouseover: function(calEvent, $event) {
          // displayMessage('<strong>Mouseover Event</strong><br/>Start: ' + calEvent.start + '<br/>End: ' + calEvent.end);
        },
        eventMouseout: function(calEvent, $event) {
          // displayMessage('<strong>Mouseout Event</strong><br/>Start: ' + calEvent.start + '<br/>End: ' + calEvent.end);
        },
        noEvents: function() {
          displayMessage('There are no events for this week');
        }
      });
    }
      function displayMessage(message) {
      $('#message').html(message).fadeIn();
    }
  $(document).ready(function() {

    handleClientLoad();

    // var apiToken = "t9bI26xcxTEt873igyo9H5bksjK4cgkp96MXnaI3AKQcbBXeOWM";
    var tmKey = "74LKUbkc0pTCkK97eB4GomC5OmRWzld3";
    var baseURL = "https://app.ticketmaster.com/discovery/v2/";

    function findConcerts(loc, date, keywords) {
      console.log('hi2');

      //Using old ajax syntax for compatibility with JQuery widget
      $.ajax({
        url: baseURL+"events.json?",
        data: {
          keyword: keywords,
          countryCode: loc,
          startDateTime: date,
          apikey: tmKey,
        },
        success: function(response) {
          var events = response._embedded.events;
          console.log(events);
          for(let i = 0; i < events.length; i++) {
            console.log(events[i]);

            var newBand = $("<div class=result>");
            var newDate = $("<div class=result>");
            var newGenre = $("<div class=result>");
            var newVenue = $("<div class=result>");
            var newSaleStart = $("<div class=result>");
            var newSaleEnd = $("<div class=result>");
            var newSeatmap = $("<div class=result>");
            var newPrice = $("<div class=result>");
            var newAddEvent = $("<div class=result>");
            var newPurchase = $("<div class=result>");

            var bandName = events[i].name;
            var url = events[i].url;
            var saleStart = new Date(events[i].sales.public.startDateTime);
            var saleStop = new Date(events[i].sales.public.endDateTime);
            var eventDate = undefined;
            if (events[i].dates.start.dateTBD === "true") {
              eventDate = "TBD"
            } else {
              eventDate = events[i].dates.start.dateTime;
            }

            var genre = events[i].classifications[0].genre.name;
            var priceMin = events[i].priceRanges[0].min;
            var priceMax = events[i].priceRanges[0].max;
            var seatmap = events[i].seatmap.staticUrl;
            var venue = events[i]._embedded.venues[0].name;

            var venueLat = events[i]._embedded.venues[0].location.latitude;
            var venueLong = events[i]._embedded.venues[0].location.longitude;
            saleStart = `${saleStart.getMonth()}/${saleStart.getDate()}/${saleStart.getFullYear()} + ${saleStart.getHours()}:${saleStart.getMinutes()}`;
            saleStop = `${saleStop.getMonth()}/${saleStop.getDate()}/${saleStop.getFullYear()} + ${saleStop.getHours()}:${saleStop.getMinutes()}`;
          
            newBand.append(bandName);
            newDate.append(eventDate);
            newGenre.append(genre);
            newVenue.append(venue);
            newSaleStart.append(saleStart);
            newSaleEnd.append(saleStop);
            newSeatmap.append(seatmap);
            newPrice.append($(`<h5>$${priceMin} - ${priceMax}</h5>`));
            newAddEvent.append($("<h5> add to calendar </h5>"));
            newPurchase.append($("<h5> buy tix </h5>"));

            $(".results").append(newBand);
            $(".results").append(newDate);
            $(".results").append(newGenre);
            $(".results").append(newVenue);
            $(".results").append(newSaleStart);
            $(".results").append(newSaleEnd);
            $(".results").append(newSeatmap);
            $(".results").append(newPrice);
            $(".results").append(newAddEvent);
            $(".results").append(newPurchase);
          }
        }
      });
    }

    //create scrollable list of results
    function scrollResults() {
      console.log("Scrolling");
      $(".results").css('height', '20em');
      console.log($(".results").css('height'))
      $(".results").css('overflow-y', 'scroll');
    };

    $('button.bands-submit').click(function() {
      var location = $("#user-location").val();
      var date = $("#date-req").val();
      var keywords = $("#user-keyword").val();

      scrollResults();
      findConcerts(location, date, keywords);
    });

    function dateHeaderClicks() {
      	var dateHeader = document.getElementsByClassName("wc-day-column-header");
      	console.log('header len',dateHeader.length);
      	for (var i=0; i<dateHeader.length; i++) {
      		console.log('header i',dateHeader[i])
      		dateHeader[i].addEventListener('click', () => {
      			//console.log(event.target.nodeName);
      			console.log("Clicked");
      			//which day was clicked?
      			//search that day
      		});
      	}
      }


    $('<div id="message" class="ui-corner-all"></div>').prependTo($('body'));
  });
