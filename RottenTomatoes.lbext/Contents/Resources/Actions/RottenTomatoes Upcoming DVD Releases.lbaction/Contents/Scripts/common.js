/*
 * This script is copied (grunt) to each action directory so they can share
 * common log in and HTTP request behaviour. It is included in each action with
 * the LaunchBar specific `include` function, but this seems to require the
 * shared script to be in the same directory as the calling script.
 */


/**
 * Just globally store the API token after reading from the file.
 */
var apiToken_;

/**
 * Reads the saved API token from a support file.
 * If the file cannot be read, prompts the user for
 * the API token to save.
 *
 * @return {boolean} true if the token was loaded (user is logged in).
 */
function loadApiToken() {
    var file = Action.supportPath;
    // LaunchBar 6.1 added a trailing slash to this path. Try to work with either.
    var tailRe = /Action Support\/?/;
    var m = tailRe.exec(file);
    var tailIndex = m.index;
    var tailLength = m[0].length;
    // The file is save in the support folder for the Pinboard Log In action.
    // Different actions can't share a support folder, so just hard-code where it is.
    file = file.slice(0, tailIndex + tailLength) + 'com.bytedash.LaunchBar.action.RottenTomatoesLogin/api-token.txt';
    
    try {
        LaunchBar.log('Will read API toke file at: ' + file);
        apiToken_ = File.readText(file);
        return true;
    }
    catch (e) {
        LaunchBar.log('Failed to read log in token. ' + e);
        return false;
    }
}

/**
 * Return a single action result to defers to the login in action.
 * Used from other actions that can't get the API token (not logged in yet).
 *
 * @return {array} single action to log in.
 */
function loginErrorAsListResults() {
    return [{
            title: 'Log In to Rotten Tomatoes',
            subtitle: 'Continue to log in with LaunchBar.',
            actionBundleIdentifier: 'com.bytedash.LaunchBar.action.RottenTomatoesLogin'
            }];
}

/**
 * HTTP GET a give Rotten Tomatoes. Automatically requests JSON format
 * and include the API token (which must be loaded with loadApiToken first).
 *
 * Will automatically prompt for a new API token if hits a 401.
 *
 * @param  {string} url    URL to load.
 * @param  {object} params optional hash of parameter names to values.
 * @return {object}        the JSON result. null if not loaded.
 */
function getUrl(url, params) {
    url = url + '&apikey=' + apiToken_;
    
    if (params) {
        for (var name in params) {
            url += '&' + name + '=' + params[name];
        }
    }
    
    LaunchBar.debugLog('GET ' + url);
    
    var result = HTTP.getJSON(url);
    
    if (result.data) return result.data;
    
    if (result.response.status === 401) {
        LaunchBar.alert(
                        'You are no longer logged in to Rotten Toematoes through LaunchBar.',
                        'Your API token is wrong or has expired. You must enter it again.');
        LaunchBar.performAction('Rotten Tomatoes Login');
        return null;
    }
    else {
        LaunchBar.alert(
                        'Could not contact Rotten Tomatoes.',
                        'This may be a temporary error. Try again later.\n\Rotten Tomatoes said: ' + result.response.status + ' ' + result.response.localizedStatus);
        return null;
    }
}

/**
 * @param  {array} posts the Pinboard post objects as returned from HTTP JSON requests.
 * @return {array}       LaunchBar results.
 */
function postsAsListResults(results) {
    var results = results.movies;
    var items = [];
    
    var suggestions = [];
    
    for (var i = 0; i < results.length; i++) {
        var result = results[i];
        
        suggestions.push({
                         title: result.title+" ("+result.year+")",
                         url: result.links.alternate,
                         icon: "at.obdev.LaunchBar:MoviesTemplate",
                         subtitle: result.runtime+"mins critcs:"+result.ratings.critics_score+"/"+result.ratings.critics_rating+" audience:"+result.ratings.audience_score+"/"+result.ratings.audience_rating+" mpaa:"+result.mpaa_rating
                         });
    };
    
    return suggestions;
}







