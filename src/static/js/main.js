var _currentTerms = null;
var _extractedData = null;

$("document").ready(function () {
    $("#search_article").on("click", function (e) {
        var url = $('#search_input_field').val();
        if (url) {
            analyzeUrl(url);
        }
    });
    //uncomment for testing more quickly
    analyzeUrl('https://www.nu.nl/voetbal/4978826/oranjevrouwen-geridderd-behalen-europese-titel.html');
});

//main function called by pressing GO!
function analyzeUrl(url) {
    $.when(
        $.ajax(_p + '/parse?url=' + url)
    ).then(function (data, textStatus, jqXHR) {
        // By passing a URL we get an object with {url: <url>, title: <title>, text: <text>}
        // Retrieve the object and build the url for the extractedTerms.
        _extractedData = data;
        callSearchTermsAndSegments(url);
    });
}

function urlencode(text) {
    return encodeURIComponent(text).replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A')
        .replace(/%20/g, '+')
}

function generateTermExtractionURL() {
    var parsedData = JSON.parse(_extractedData);
    var trunkedString = parsedData.text.substring(0, 128);
    var url = _p + '/termextract?title=';
    url += encodeURIComponent(urlencode(parsedData.title));
    url += '&text=' + encodeURIComponent(urlencode(trunkedString))
    url += '&c=8';
    return url
}

function generateRecommendationsURL() {
    var partialUrlTerms = '';
    $.each(_currentTerms, function (i, item) {
        partialUrlTerms += item.probability + "(" + item.tuple[0] + ")" + encodeURIComponent(urlencode("|"));
    });
    return _p + '/recommend?tuplelist=' + partialUrlTerms;
}

//does the term extraction and recommendation subsequently
function callSearchTermsAndSegments() {
    // zoekwooden. Load search terms table.
    // build API url for on success get suggested segments
    $.ajax({
        url: generateTermExtractionURL(_extractedData),
        context: document.body
    }).done(function (termsObject) {
        _currentTerms = termsObject.items;
        generateTermTable();
        callRecommendations();
    });
}

function callRecommendations() {
    $.ajax({
        url: generateRecommendationsURL(),
        context: document.body
    }).done(function (e) {
        generateRecommendationTable(e);
    });
}

//draws the table filled with recommendations
function generateRecommendationTable(e) {
    console.debug('generate recommendations table');

    //clean the previous state
    $('#recommendedSegments').html('');

    //regenerate the table
    var html = [];
    html.push('<table class="table table-bordered table-hover">');
    html.push('<thead><tr><th><span class="glyphicon glyphicon-shopping-cart"></span></th>');
    html.push('<th>Description</th><th>View</th> </tr></thead><tbody>');

    $.each(e.items, function (key, item) {
        console.debug(item)
        var playoutUrl = null;
        if(item.tuple[0].attributes.distributionChannel == 'television') {
            playoutUrl = _v + '/' + item.tuple[0].attributes.carrierreference;
        } else {
            playoutUrl = _a + '/' + item.tuple[0].attributes.dmguid;
        }
        console.debug(playoutUrl);
        html.push('<tr><td><input id="checkBox" type="checkbox"></td><td>');
        html.push(item.tuple[0].attributes.description + '</td>');
        html.push('<td><a href="'+playoutUrl+'">');
        html.push('<span class="glyphicon glyphicon-film"></span></a></td></tr>');
    });

    html.push('</tbody></table>');
    $('#recommendedSegments').html(html.join(''));
}

//draws a table based on the retrieved terms
function generateTermTable() {
    //clear the previous contents
    $('#searchTerms').html('');

    //generate the new stuff
    if(_currentTerms) {
        var html = ['<table class="table table-bordered table-hover"><thead><tr><th>Zoekwoorden</th></tr></thead><tbody>'];
        $.each(_currentTerms, function (i, item) {
            html.push('<tr><td><span class="searchTerm">' + item.tuple[0] + '</span>');
            html.push('<button id="__term__'+i+'" type="button" class="btn btn-danger btn-xs pull-right removeFilter">');
            html.push('<span class="glyphicon glyphicon-remove"></span> Remove</button></p></td></tr>');
        });
        html.push('</tbody></table>');
        $('#searchTerms').html(html.join(''));
        $('.removeFilter').on("click", function(e) {
            removeTerm(e.target.id);
        });
    }
}

function removeTerm(elmId) {
    var index = parseInt(elmId.substring(8));
    _currentTerms.splice(index, 1);
    generateTermTable();
    callRecommendations();
}
