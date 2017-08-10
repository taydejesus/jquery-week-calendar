
$(function() {
	// var apiToken = "t9bI26xcxTEt873igyo9H5bksjK4cgkp96MXnaI3AKQcbBXeOWM";
	var tmKey = "74LKUbkc0pTCkK97eB4GomC5OmRWzld3";
	var baseURL = "https://app.ticketmaster.com/discovery/v2/";


	function findConcerts(loc, date, keywords) {

		$.ajax({
			url: baseURL+"events.json?",
			data: {
				keyword: keywords,
				countryCode: loc,
				apikey: tmKey,
			}
		}).done(function(response) {
			var events = response._embedded.events;
			console.log(events);

			for(let i = 0; i < events.length; i++) {
				console.log(events[i]);
				let bandName = events[i].name;
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

				$(".band-name").text(bandName);
				$(".date").text(eventDate);
				$(".genre").text(genre);
				$(".location").text(venue);
				$(".sale-start").text(saleStart);
				$(".sale-end").text(saleStop);
				$(".seatmap").text(seatmap);
				$(".price").text("" + priceMin + " - " + priceMax);
				$(".add-event").text("purchase");
				$(".purchase").text(url);

			}


		})

	}

	$('button.bands-submit').on('click', function() {
		var location = $("#user-location").val();
		var date = $("#date-req").val();
		var keywords = $("#user-keyword").val(); 

		findConcerts(location, date, keywords);
	});

});