include('common.js');

function run()
{

    if (!loadApiToken()) {return loginErrorAsListResults();}

    var results = getUrl('http://api.rottentomatoes.com/api/public/v1.0/lists/movies/opening.json?country=us', {
                         limit: 40
                         });
    if (!results) return;

    var suggestions = postsAsListResults(results);
    
	if (suggestions.length === 0)
    {
        return [ {
                title: "No results found",
                icon: "at.obdev.LaunchBar:InfoTemplate"
                } ];
    }

    return suggestions;
}
