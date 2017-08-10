  // var eventData = {
  //   events : [
  //     {'id':1, 
  //     'start': new Date(year, month, day, 12), 
  //     'end': new Date(year, month, day, 13, 35),
  //     'title':'Lunch with Mike'},
  //     {'id':2, 'start': new Date(year, month, day, 14), 'end': new Date(year, month, day, 14, 45),'title':'Dev Meeting'},
  //     {'id':3, 'start': new Date(year, month, day + 1, 18), 'end': new Date(year, month, day + 1, 18, 45),'title':'Hair cut'},
  //     {'id':4, 'start': new Date(year, month, day - 1, 8), 'end': new Date(year, month, day - 1, 9, 30),'title':'Team breakfast'},
  //     {'id':5, 'start': new Date(year, month, day + 1, 14), 'end': new Date(year, month, day + 1, 15),'title':'Product showcase'}
  //   ]
  // };

		// $.ajax({
		// 	url: baseURL+"events.json?",
		// 	data: {
		// 		keyword: keywords,
		// 		countryCode: loc,
		// 		apikey: tmKey,
		// 	}
		// }).done(function(response) {
		// 	var events = response._embedded.events;
		// 	console.log(events);

		// 	for(let i = 0; i < events.length; i++) {
		// 		console.log(events[i]);

		// 		var newBand = $("<div class=result>");
		// 		var newDate = $("<div class=result>");
		// 		var newGenre = $("<div class=result>");
		// 		var newVenue = $("<div class=result>");
		// 		var newSaleStart = $("<div class=result>");
		// 		var newSaleEnd = $("<div class=result>");
		// 		var newSeatmap = $("<div class=result>");
		// 		var newPrice = $("<div class=result>");
		// 		var newAddEvent = $("<div class=result>");
		// 		var newPurchase = $("<div class=result>");

		// 		var bandName = events[i].name;
		// 		var url = events[i].url;
		// 		var saleStart = events[i].sales.public.startDateTime;
		// 		var saleStop = events[i].sales.public.endDateTime;
		// 		var eventDate = undefined;
		// 		if (events[i].dates.start.dateTBD === "true") {
		// 			eventDate = "TBD"
		// 		} else {
		// 			eventDate = events[i].dates.start.dateTime;
		// 		}

		// 		var genre = events[i].classifications[0].genre.name;
		// 		var priceMin = events[i].priceRanges[0].min;
		// 		var priceMax = events[i].priceRanges[0].max;
		// 		var seatmap = events[i].seatmap.staticUrl;
		// 		var venue = events[i]._embedded.venues[0].name;

		// 		var venueLat = events[i]._embedded.venues[0].location.latitude;
		// 		var venueLong = events[i]._embedded.venues[0].location.longitude;

		// 		newBand.append(bandName);
		// 		newDate.append(eventDate);
		// 		newGenre.append(genre);
		// 		newVenue.append(venue);
		// 		newSaleStart.append(saleStart);
		// 		newSaleEnd.append(saleStop);
		// 		newSeatmap.append(seatmap);
		// 		newPrice.append($(`<h5>${priceMin} - ${priceMax}</h5>`));
		// 		newAddEvent.append($("<h5> add to calendar </h5>"));
		// 		newPurchase.append($("<h5> buy tix </h5>"));

		// 		$(".results").append(newBand);
		// 		$(".results").append(newDate);
		// 		$(".results").append(newGenre);
		// 		$(".results").append(newVenue);
		// 		$(".results").append(newSaleStart);
		// 		$(".results").append(newSaleEnd);
		// 		$(".results").append(newSeatmap);
		// 		$(".results").append(newPrice);
		// 		$(".results").append(newAddEvent);
		// 		$(".results").append(newPurchase);

		// 		// $(".band-name").text(bandName);
		// 		// $(".date").text(eventDate);
		// 		// $(".genre").text(genre);
		// 		// $(".location").text(venue);
		// 		// $(".sale-start").text(saleStart);
		// 		// $(".sale-end").text(saleStop);
		// 		// $(".seatmap").text(seatmap);
		// 		// $(".price").text("" + priceMin + " - " + priceMax);
		// 		// $(".add-event").text("purchase");
		// 		// $(".purchase").text(url);
		// 	}

		// })
