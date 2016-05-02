$("#search-form").submit(function(e)
{
	console.log($("#skills").val());
	$.getJSON("/search", {skills: $("#skills").val()}, function(data) {console.log(data)});
	e.preventDefault();
});


// Token field for skills input
$('#skills').tokenfield({
	duplicateChecker: true, // Apparently doesn't work
	autocomplete: 
	{
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
								value: entry});
					res(skills);
				});
		},
		delay: 100
	},
	showAutocompleteOnFocus: true
})

// Prevent duplicates
$('#skills').on('tokenfield:createtoken', function (event) {
	var existingTokens = $(this).tokenfield('getTokens');
	$.each(existingTokens, function(index, token) {
		if (token.value === event.attrs.value)
			event.preventDefault();
	});
});
