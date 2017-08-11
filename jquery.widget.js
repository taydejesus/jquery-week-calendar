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
        clearCal();
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
              //Check if this event and time are in the existing list of objects.
              if((isInCalendar(tempObject.title, tempObject.start)) === false) {
                calendarEvents.events.push(tempObject);
                console.log("Added");
              }
              // calendarEvents.events.push(tempObject);

            }
          }
          makeCal();
          dateHeaderClicks();
        });
      }
      function strMonthToInt(month) {
        month = month.toLowerCase();
        switch (month) {
          case "jan":
            month = "00";
            break;
          case "feb":
            month = "01";
            break;
          case "mar":
            month = "02";
            break;
          case "apr":
            month = "03";
            break;
          case "may":
            month = "04";
            break;
          case "jun":
            month = "05";
            break;
          case "jul":
            month = "06";
            break;
          case "aug":
            month = "07";
            break;
          case "sep":
            month = "08";
            break;
          case "oct":
            month = "09";
            break;
          case "nov":
            month = "10";
            break;
          case "dec":
            month = "11";
            break;
          default:
            alert("Error parsing date. ");
        }
        return month;
      }

      function isInCalendar(title, startTime) {
        for (let i = 0; i < calendarEvents.events.length; i++) {
          if ((calendarEvents.events[i].title === title) & (calendarEvents.events[i].start.getTime() === startTime.getTime())) {
            // console.log("FOUND A MATCH");
            // console.log(title);
            // console.log(calendarEvents.events[i].title);
            return true;
          }
        }
        return false;
      }

      function dateHeaderClicks() {
        	var dateHeader = document.getElementsByClassName("wc-day-column-header");
        	for (const date of dateHeader) {
        		date.addEventListener('click', () => {
        			//get date of clicked item
                //get text after <br>
                var fullText = date.textContent.split(" ");

                //separate month from day
                var month = fullText[0].substr(fullText[0].length-3, fullText[0].length-1);

                month = strMonthToInt(month);
                console.log('str int month',month);
                var day = fullText[1].split(',');
                day = day[0];

                var year = fullText[2];

                //change to date format
                var formattedDate = new Date(year, month, day);
                var location = $("#user-location").val();

                var keywords = $("#user-keyword").val();

                console.log(formattedDate);
                formattedDate = `${year}-${month}-${day}T00:00:00Z`;
        			//search date and make new table
                $('.result').remove();
                scrollResults();
                findConcerts(location, formattedDate, keywords);
      		  });
      	  }
      }

      function clearCal() {
        $("#calendar").empty();
        $('.result').remove();
        $(".results").css('height', '1.8em');
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
        }
      });
    }

 function addNewEvent(eventTitle, eventDate) {
        console.log('here');
        console.log(eventTitle);

        var newEvent = {}
        var start = new Date(eventDate);

        console.log(start);
        console.log(typeof(start));

        var startTime = undefined;
        var endTime = undefined;
        if(!eventDate) {
          startTime = undefined;
          endTime = undefined;
        } else {
          startTime = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), start.getMinutes())
          endTime = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours()+1, start.getMinutes())
        }

        newEvent.id = calendarEvents.events[calendarEvents.events.length-1].id + 1;
        newEvent.start = startTime;
        newEvent.end = endTime;
        newEvent.title = eventTitle;
        if((isInCalendar(newEvent.title, newEvent.start)) === false) {
                calendarEvents.events.push(newEvent);
                console.log("Added New");
        }
        // calendarEvents.events.push(newEvent);
        console.log(calendarEvents);
        $("#calendar").empty();
        makeCal();

    }


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
              eventDate = new Date(events[i].dates.start.dateTime);
            }

            var viewMap = $("<a>")
            viewMap.attr("href", events[i].seatmap.staticUrl);
            viewMap.text("View")

            var buyTicket = $("<a>");
            buyTicket.attr("href", url);
            buyTicket.text("Buy Ticket");

            var addCalendar = $("<a>");
            addCalendar.text("Add to Calendar");
            addCalendar.click(function() {addNewEvent(events[i].name, new Date(events[i].dates.start.dateTime))});

            var genre = events[i].classifications[0].genre.name;
            var priceMin = events[i].priceRanges[0].min;
            var priceMax = events[i].priceRanges[0].max;
            var venue = events[i]._embedded.venues[0].name;

            var venueLat = events[i]._embedded.venues[0].location.latitude;
            var venueLong = events[i]._embedded.venues[0].location.longitude;
            eventDate = `${eventDate.getMonth()}/${eventDate.getDate()}/${eventDate.getFullYear()}  ${eventDate.getHours()}:${eventDate.getMinutes()}`;
            saleStart = `${saleStart.getMonth()}/${saleStart.getDate()}/${saleStart.getFullYear()}  ${saleStart.getHours()}:${saleStart.getMinutes()}`;
            saleStop = `${saleStop.getMonth()}/${saleStop.getDate()}/${saleStop.getFullYear()}  ${saleStop.getHours()}:${saleStop.getMinutes()}`;

            newBand.append(bandName);
            newDate.append(eventDate);
            newGenre.append(genre);
            newVenue.append(venue);
            newSaleStart.append(saleStart);
            newSaleEnd.append(saleStop);
            newSeatmap.append(viewMap);
            newPrice.append($(`<h5>$${priceMin} - $${priceMax}</h5>`));
            newAddEvent.append(addCalendar);
            newPurchase.append(buyTicket);

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

//




  $(document).ready(function() {

    handleClientLoad();


  });

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
    $('.result').remove();
    scrollResults();
    findConcerts(location, date, keywords);
  });
