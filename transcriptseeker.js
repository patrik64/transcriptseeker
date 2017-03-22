var videoID = '8b1Il09WOsc';
var searchString = 'trump';

///////////////////////////////////////////////////////////////////////////////////////////////

var fs = require('fs');
var youtubedl = require('youtube-dl');
var url = 'https://youtu.be/' + videoID;
var result = url + '?t=';
searchString = searchString.toLowerCase();

var options = {
  // Write automatic subtitle file (youtube only) 
  auto: true,
  // Downloads all the available subtitles. 
  all: false,
  // Languages of subtitles to download, separated by commas. 
  lang: 'en',
  // The directory to save the downloaded files in. 
  cwd: __dirname,
};

var transcripts = [];
youtubedl.getSubs(url, options, function(err, files) {
    if (err) throw err;
    //console.log('subtitle files downloaded:', files);
    if(files.length == 0) {
        console.log('no transcripts available, try changing transcript download parameters ...');
    } else {
        processTranscripts(files);
    }
});

function processTranscripts(transcripts) {
    for(var i in transcripts) {
        processTranscript(transcripts[i]);
    }
}

function processTranscript(ts) {
    console.log('processing -> ', ts);

    var input = fs.readFileSync(ts, 'utf8');
    var arr = input.split('\n');
    var tt = parse(arr);

    for(var i in tt) {
        var str = tt[i]["str"];
        if(str.indexOf(searchString) >= 0) {
            var output = result + tt[i]["startTime"];
            console.log(output);
        }
    }
}

function parse(arr) {
    var ret = [];
    var obj = {};

    var i = 4;
    while( i < arr.length ) {
        if(arr[i].length > 0) {
            var sTime = parseTime(arr[i]);
            i = i+1;
            var str = arr[i];
            i = i+1;
            while(i < arr.length && arr[i].length > 0) {
                str += ' ';
                str += arr[i];
                i = i+1;
            }
            
            str = str.toLowerCase();
            obj = { 'startTime' : sTime, 'str' : str };
            ret.push(obj);
        }
        i = i+1;
    }
    return ret;
}

function parseTime(str) {
    var h = str[0] + str[1];
    var m = str[3] + str[4];
    var s = str[6] + str[7];
    var ret = h + 'h' + m + 'm' + s + 's';
    return ret;
}