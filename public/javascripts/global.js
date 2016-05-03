var pcCoords = [];
var pcCoordsLock = false;


$("#search-form").submit(function(e)
{
        e.preventDefault();

        // Either postcode or skills must be present
        if(pcCoords.length == 0 && $("#skills").val() == "")
                highlightMissing("#postcode");
        else
        {
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
                                        
                                        var skills = carer.skills.map(sk => sk["name"]).join(', ');
                                        $("#results").append(
                                                "<div class='carer-box'>" +
                                                "<p class='carer-name'>" + carer["name"] + "</p>" +
                                                "<p class='carer-skills'>Experience in: " + skills + "</p>" +
                                                distanceLine +
                                                "</div>");
                                });
                        });
        }
});

/*
 * Register form: just add the client-resolved coords for their postcode
 */
$("#register-form").submit(function(e)
{
        if(pcCoords != undefined && pcCoords.length == 2)
        {
                var coordsHolder = "<input type='hidden' name='coords' value='" + pcCoords + "'>";
                $(this).append(coordsHolder);
        }
        else
        {
                highlightMissing("#postcode");
                e.preventDefault();
        }
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

// Search skills entry: prevent duplicates
// TODO: Causes issues with gecko, fix commented parts
$('#skills').on('tokenfield:createtoken', function (event) {
	console.log(event.attrs);
        if(isNaN(event.attrs.value)) //only numbers are ok
        {
                //$(".skills-chooser").val(""); //remove slack text
                return false;
        }
        /*
        */

});

// Registration skills entry:
$('#register-skills').on('tokenfield:createtoken', function (event) {
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
$(".postcode-coords-resolver").keyup(resolveCoords);
function resolveCoords()
{
        var input = $(this);

        //shortest postcode length = 5
        //http://www.answers.com/Q/What_is_the_shortest_postal_code_in_UK
        if(input.val().length < 5) 
                return;

        var getPostcodeCoords = function()
        {
                // Prevent user action while resolving postcode
                pcCoordsLock = true;
                $(".submit-button").prop("disabled", true);

                $.getJSON("http://api.postcodes.io/postcodes/" + $("#postcode").val(), 
                        function(resp)
                        {
                                if(resp["result"]["longitude"] && resp["result"]["latitude"])
                                {
                                        pcCoords = [resp["result"]["longitude"], resp["result"]["latitude"]];
                                        highlightCorrect(input);
                                }
                                pcCoordsLock = false;
                                $(".submit-button").prop("disabled", false);
                        }).error(
                        function()  //404
                        {
                                highlightMissing(input);
                                pcCoords = [];
                                pcCoordsLock = false;
                                $(".submit-button").prop("disabled", false);
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

// Makes an input field red
function highlightMissing(elem)
{
        $(elem).css("border-color", "red");
}
// Makes an input field red
function highlightCorrect(elem)
{
        $(elem).css("border-color", "green");
}
