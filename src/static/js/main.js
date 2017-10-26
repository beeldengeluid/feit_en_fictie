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
    $('#modal').modal({show : false})
});

/*
------------------ MAIN FUNCTIONS -------------------
*/

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

/*
------------------ TERM EXTRACT FUNCTIONS -------------------
*/

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

function generateTermExtractionURL() {
    var parsedData = JSON.parse(_extractedData);
    var trunkedString = parsedData.text.substring(0, 128);
    var url = _p + '/termextract?title=';
    url += encodeURIComponent(urlencode(parsedData.title));
    url += '&text=' + encodeURIComponent(urlencode(trunkedString))
    url += '&c=8';
    return url
}

/*
------------------ RECOMMENDATION FUNCTIONS -------------------
*/

function generateRecommendationsURL() {
    var partialUrlTerms = '';
    $.each(_currentTerms, function (i, item) {
        partialUrlTerms += item.probability + "(" + item.tuple[0] + ")" + encodeURIComponent(urlencode("|"));
    });
    return _p + '/recommend?tuplelist=' + partialUrlTerms;
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
        var playoutData = getPlayoutData(item);
        html.push('<tr><td><input id="checkBox" type="checkbox"></td><td>');
        html.push(getDescription(item) + '</td>');
        html.push('<td>');
        if(playoutData) {
            html.push('<a onclick="showPlayer(\''+playoutData.url+'\', '+playoutData.start+')"><span class="glyphicon glyphicon-film"></span></a>')
        }
        html.push('</td></tr>');
    });

    html.push('</tbody></table>');
    $('#recommendedSegments').html(html.join(''));
}

function getDescription(item) {
    var a = item.tuple[0].attributes;
    if (a.maintitles && a.description) {
        if(a.maintitles.length > a.description.length) {
            return a.maintitles;
        } else {
            return a.description;
        }
    } else if(a.description) {
        return a.description;
    } else if(a.maintitles) {
        return a.maintitles;
    }  else if (a.program) {
        if(a.program.summary) {
            return a.program.summary;
        } else if (a.program.maintitles) {
            return a.program.maintitles
        }
    }
    return 'No title or description found'
}

function getPlayoutData(item) {
    var data = null;
    var url = null;
    var a = item.tuple[0].attributes;
    if(a.program && a.program.publication && a.program.publication[0]) {
        var p = a.program.publication[0];
        if(p.distributionchannel == 'televisie' && a.carrierreference) {
            url = _v + '/' + a.carrierreference;
        } else if (a.dmguid) {
            url = _a + '/' + a.dmguid;
        }
    }
    if(url) {
        data = {
            url : url,
            start : (a.startoncarrier - a.startoffset) / 1000 //aantal sec
        }
    }
    return data;
}

/*
------------------ PLAYOUT -------------------
*/

function showPlayer(url, secs) {
    console.debug(secs);
    var html = ['<video id="video" controls>']
    html.push('<source src="'+url+'"></source>')
    html.push('</video>');
    $('#video_player').html(html.join(''));
    var vid = document.getElementById('video');
    vid.onloadedmetadata = function(){
        console.debug('video loaded');
        vid.currentTime = secs;
        $('#modal').modal('show');

    }

}

function closeModal() {
    $('#video_player').html('');
    $('#modal').modal('hide');
}

/*
------------------ HELPER FUNCTION -------------------
*/

function urlencode(text) {
    return encodeURIComponent(text).replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A')
        .replace(/%20/g, '+')
}

