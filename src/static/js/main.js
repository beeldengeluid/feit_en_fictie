var _currentTerms = null;
var _extractedData = null;

$("document").ready(function () {
    $("#search_article, #search_input_field").on("click keypress", function (e) {
        var url = $('#search_input_field').val();
        var code = (e.keyCode ? e.keyCode : e.which);

        if (url && (code === 13) || e.target.id === 'search_article') {
            analyzeUrl(url);
        }
    });
    //uncomment for testing more quickly
    //analyzeUrl('https://www.nu.nl/voetbal/4978826/oranjevrouwen-geridderd-behalen-europese-titel.html');

    //initialize the modal
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
        callSearchTermsAndSegments();
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
    //clear the previous contents and event listeners
    $('#searchTerms').html('');
    $(".removeFilter").unbind( "click" );

    //generate the new stuff
    if(_currentTerms) {
        var html = ['<table class="table table-hover"><thead><tr><th>Zoekwoorden</th></tr></thead><tbody>'];
        $.each(_currentTerms, function (i, item) {
            html.push('<tr><td><span class="searchTerm">' + item.tuple[0] + '</span>');
            html.push('<button id="__term__'+i+'" type="button" data-value=' + item.tuple[0] + ' class="btn btn-danger btn-xs pull-right removeFilter">');
            html.push('<span class="glyphicon glyphicon-remove"></span> Verwijder</button></td></tr>');
        });

        html.push('<tr class="addNewTermField"><td class="searchTermFormCell"><div class="form-group">' +
            '<input type="text" id="newSearchTerm" class="form-control submitForm" placeholder="Zoekwoord toevoegen">' +
            '<button id="addSearchTerm" type="button" class="btn btn-default submitForm">Ga!</button>' +
            '</div></td></tr></tbody></table>');

        $('#searchTerms').html(html.join(''));
        $('.removeFilter').click(function(event) {
            removeTerm(event.currentTarget.id);
        });

        // submit search term form on click or enter event.
        $(".submitForm").on("click keypress", function (e) {
            var searchTerm = $('#newSearchTerm').val() || false;
            var targetID = e.target.id;
            var code = (e.keyCode ? e.keyCode : e.which);

            if ((searchTerm && targetID === 'addSearchTerm') || (targetID === 'newSearchTerm' && (code === 13))) {
                addTerm(e);
            }
        });
    }
}


function isPresent(array, word) {
    var isPresent = true;
    $.each(array, function(key, value) {
        if(value.tuple[0] === word) {
            isPresent = false;
            return false;
        }
    });
    return isPresent;
}

function addTerm() {
    var addedSearchTerm = $('#newSearchTerm').val().trim() || false;

    if(addedSearchTerm) {
        if(isPresent(_currentTerms, addedSearchTerm)){
            _currentTerms.push({
                probability: 0.99,
                rank: 11,
                tuple: [addedSearchTerm]
            });
            generateTermTable();
            callRecommendations(false);
        }
    }
    return false;
}


function removeTerm(elmId) {
    var index = parseInt(elmId.substring(8));
    if (!isNaN(index)) {
        _currentTerms.splice(index, 1);
        generateTermTable();
        callRecommendations(false);
    }
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
    return _p + '/recommend?tuplelist=' + encodeURIComponent(urlencode("|"))  + partialUrlTerms;
}

function callRecommendations() {
    $.ajax({
        url: generateRecommendationsURL(),
        context: document.body
    }).done(function (e) {
        if(!e.error) {
            generateRecommendationTable(e);
        } else {
            console.log('no search terms to display, do not refresh recommendations table');
        }
    });
}

//draws the table filled with recommendations
function generateRecommendationTable(e) {
    //clean the previous state
    $('#recommendedSegments').html('');

    //regenerate the table
    var html = [];
    html.push('<table class="table table-hover">');
    html.push('<thead><tr><th><span class="glyphicon glyphicon-shopping-cart"></span></th>');
    html.push('<th>Description</th><th>Datum</th><th>View</th></tr></thead><tbody>');

    $.each(e.items, function (key, item) {
        var playoutData = getPlayoutData(item);

        if(playoutData) {
            html.push('<tr><td><input id="checkBox" type="checkbox"></td><td>');
            html.push(getDescription(item) +  '</td><td class="ff_date_field">');
            html.push(getDate(item) +  '</td>');
            html.push('<td class="ff_play_field">');
            html.push('<a onclick="showPlayer(\''+playoutData.url+'\', '+playoutData.start+')">');
            if(playoutData.type == 'video') {
                html.push('<i class="fa fa-film interactive"></i>');
            } else {
                html.push('<i class="fa fa-volume-up interactive"></i>');
            }
            html.push('</a>');
        }
        html.push('</td></tr>');
    });

    html.push('</tbody></table>');
    $('#recommendedSegments').html(html.join(''));
}

function getDescription(item) {
    var desc = 'Geen titel / omschrijving'
    var a = item.tuple[0].attributes;
    if (a.maintitles && a.description) {
        if(a.maintitles.length > a.description.length) {
            desc = a.maintitles;
        } else {
            desc = a.description;
        }
    } else if(a.description) {
        desc = a.description;
    } else if(a.maintitles) {
        desc = a.maintitles;
    }  else if (a.program) {
        if(a.program.summary) {
            desc = a.program.summary;
        } else if (a.program.maintitles) {
            desc = a.program.maintitles
        }
    }
    return desc;
}

function getDate(item) {
    var desc = '';
    var a = item.tuple[0].attributes;

    if(a.program && a.program.publication && a.program.publication[0] && a.program.publication[0].startdate) {
        desc += a.program.publication[0].startdate;
    }
    return desc;

}

function getPlayoutData(item) {
    var data = null;
    var url = null;
    var type = null;
    var a = item.tuple[0].attributes;
    if(a.program && a.program.publication && a.program.publication[0]) {
        var p = a.program.publication[0];
        if(p.distributionchannel == 'televisie' && a.carrierreference) {
            url = _v + '/' + a.carrierreference;
            type = 'video'
        } else if (a.dmguid) {
            url = _a + '/' + a.dmguid;
            type = 'audio';
        }
    }
    if(url) {
        var start = (a.startoncarrier - a.startoffset) / 1000;
        if(isNaN(start)) {
            start = 0;
        }
        data = {
            url : url,
            type : type,
            start : start //aantal sec
        }
    }
    return data;
}

/*
------------------ PLAYOUT -------------------
*/
function showPlayer(url, secs) {
     // console.debug(secs);
    var html = ['<video id="video" controls>']
    html.push('<source src="'+url+'"></source>')
    html.push('</video>');
    $('#video_player').html(html.join(''));
    var vid = document.getElementById('video');
    vid.onloadedmetadata = function(){
        // console.debug('video loaded', secs);
        if(isNaN(secs)) {
            secs = 0;
        }
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

