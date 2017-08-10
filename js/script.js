
$(function() {
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
					var saleStart = events[i].sales.public.startDateTime;
					var saleStop = events[i].sales.public.endDateTime;
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

					newBand.append(bandName);
					newDate.append(eventDate);
					newGenre.append(genre);
					newVenue.append(venue);
					newSaleStart.append(saleStart);
					newSaleEnd.append(saleStop);
					newSeatmap.append(seatmap);
					newPrice.append($(`<h5>${priceMin} - ${priceMax}</h5>`));
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
		$(".results").css('height', '10em');
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

	$(".wc-day-column-header").click(function() {
		//which day was clicked?
		//search that day
	});

});
