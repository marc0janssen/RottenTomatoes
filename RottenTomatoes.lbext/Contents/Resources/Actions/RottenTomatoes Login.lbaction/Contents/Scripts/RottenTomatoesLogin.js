function run(apiToken) {
	var results = [];

	results.push({
		title: 'Enter your Rotten Tomatoes API token',
		subtitle: 'Enter you API token here to access Rotten Tomatoes account from LaunchBar',
		//icon: 'login.png',
		action: 'saveApiToken',
		actionArgument: apiToken,
	});

	results.push({
		title: 'Register for an API token',
		subtitle: 'Get your API token on Rotten Tomatoes',
		url: 'http://developer.rottentomatoes.com/member/register'
	});

	if (File.exists(apiTokenPath())) {
		results.push({
			title: 'Log Out',
			subtitle: 'Delete your saved API token',
			action: 'deleteApiToken'
		});
	}

	return results;
}

function apiTokenPath() {
	return Action.supportPath + '/api-token.txt';
}

function saveApiToken(apiToken) {
	// Test with a known Pinboard URL. Any non-error means it's good.
	var result = HTTP.getJSON('http://api.rottentomatoes.com/api/public/v1.0/lists/movies/box_office.json?limit=16&country=us&apikey=' + apiToken);

	if (result.response.status !== 200) {
		LaunchBar.alert(
			'Unable to get data from Rotten Tomatoes.',
			'The API token you entered was not accepted. Try copying and pasting the API token from your Rotten Tomatoes Develeoper settings and try again. \n\nRotten Tomatoes said: ' + result.response.status  + ' ' + result.response.localizedStatus);
		LaunchBar.performAction('Rotten Tomatoes Login');
		return;
	}

	// Multiple actions want to access this, so save in a common location instead of the support path just for this action.
	File.writeText(apiToken, apiTokenPath());

	LaunchBar.displayNotification({
		string: 'Valid Rotten Tomatoes Token entered.'
	});
}

function deleteApiToken() {
	try {
		LaunchBar.execute('/bin/bash', '-c', 'rm \'' + apiTokenPath() + '\'');
	}
	catch (e) {
		LaunchBar.log('Log Out failed: ' + e);
		LaunchBar.alert(
			'Could not log out.',
			'Your API token file was not deleted. You can try manually deleting the file at ' + apiTokenPath());
	}
}
