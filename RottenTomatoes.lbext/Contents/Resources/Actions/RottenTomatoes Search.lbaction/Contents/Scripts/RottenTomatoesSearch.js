include('common.js');


function sleep(milliseconds) {
    var end = new Date().getTime() + milliseconds;
    while (end > new Date().getTime())
    {
        continue;
    }
}


function run()
{
    // No argument passed, just open the website:
    LaunchBar.openURL('http://www.rottentomatoes.com/');
}


function runWithString(argument)
{
    
    if (!argument){ return[]; }
    
    if (!loadApiToken()) {return loginErrorAsListResults();}
    
    //sleep(300); // Slow our requests to be nice to Rotten Tomatoes

    var results = getUrl('http://api.rottentomatoes.com/api/public/v1.0/movies.json?page=1&q=' + encodeURIComponent(argument), {
                      page_limit: 40
                      });
    
    if (!results) return;

    var suggestions = postsAsListResults(results);
    return suggestions;
}
