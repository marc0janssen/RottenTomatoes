include('common.js');

function run()
{

    if (!loadApiToken()) {return loginErrorAsListResults();}

    var results = getUrl('http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/top_rentals.json?country=us', {
                         limit: 40
                         });
    if (!results) return;

    var suggestions = postsAsListResults(results);
    return suggestions;
}
