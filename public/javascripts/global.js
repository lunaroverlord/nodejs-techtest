var pcCoords = [];
var pcCoordsLock = false;


$("#search-form").submit(function(e)
{
	console.log("sending pcCoords ", pcCoords);
	$.getJSON("/search", {skills: $("#skills").val(), target: pcCoords},
		function(data)
		{
			console.log(data);

			$("#results").empty();
			data.sort(function(a, b)
			{
				return a["distance"] > b["distance"] ? 1 : -1;
			});
			data.forEach(function(carer)
			{
				var distanceLine = "";
				if(carer["distance"] > 0)
					distanceLine += "<p>Distance: " + Math.round(carer["distance"]) + "km</p>";

				$("#results").append(
					"<div class='carer-box'>" +
					"<p class='carer-name'>" + carer["name"] + "</p>" +
					"<p class='carer-skills'>Experience in: " + $("#skills").attr("label") + "</p>" +
					distanceLine +
					"</div>");
			});
		});
	e.preventDefault();
});


/*
 * Token field for skills input
 */
$('.skills-chooser').tokenfield({
	duplicateChecker: true, // Apparently doesn't work
	autocomplete: 
	{
		// Retrieve all skills
		source: function(req, res)
		{
			// Avoid dumping the whole list for 0-length queries
			if(req.term.length == 0)
				return;

			// Get skills from the server
			$.getJSON("/get-skills",  {q: req.term},
				function(data) 
				{

					skills = [];
					for(var entry in data)
						skills.push({label: data[entry]["name"],
								value: data[entry]["id"]});
					res(skills);
				});
		},
		delay: 100,
		focus: function (event, ui) {
			$(this).val(ui.item.label);
			return false;
		}
	},
	showAutocompleteOnFocus: true
});

// Prevent duplicates in skills field
$('#skills').on('tokenfield:createtoken', function (event) {
	var existingTokens = $(this).tokenfield('getTokens');
	$.each(existingTokens, function(index, token) {
		if (token.label === event.attrs.label)
			event.preventDefault();
	});

});


/*
 * Find coords from postcode (when entered), store in global pcCoords
 */
$(".postcode-coords-resolver").change(resolveCoords);
$(".postcode-coords-resolver").blur(resolveCoords);
function resolveCoords()
{
	var input = $(this);
	var getPostcodeCoords = function()
	{
		pcCoordsLock = true;
		$.getJSON("http://api.postcodes.io/postcodes/" + $("#postcode").val(), 
			function(resp)
			{
				//console.log(resp);
				if(resp["result"]["longitude"] && resp["result"]["latitude"])
				{
					pcCoords = [resp["result"]["longitude"], resp["result"]["latitude"]];
					$(input).css("border", "2px solid green");
				}
				pcCoordsLock = false;
			}).error(
				function()  //404
				{
					$(input).css("border", "1px solid red");
					pcCoords = [];
					pcCoordsLock = false;
				});
	}

	delay(getPostcodeCoords, 400);  //400ms from event until coords are retrieved
}

//Delay helper function
var delay = (function()
{
	var timer = 0;
	return function(callback, ms)
	{
		clearTimeout (timer);
		timer = setTimeout(callback, ms);
	};
})();
