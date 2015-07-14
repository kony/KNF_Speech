var KonyMain = java.import('com.konylabs.android.KonyMain');
var context = KonyMain.getActivityContext();
var RecognizerIntent = java.import('android.speech.RecognizerIntent');
var TextToSpeech = java.import('android.speech.tts.TextToSpeech');
var Engine = java.import('android.speech.tts.TextToSpeech$Engine');
var Intent = java.import('android.content.Intent');
var IntentFilter = java.import('android.content.IntentFilter');
var Locale = java.import('java.util.Locale');
var SearchManager = java.import('android.app.SearchManager');

var t1;
var DISPLAY_REQUEST_CODE = 1234;
var VOICE_TO_TEXT_REQUEST_CODE = 1235;
var CONVERT_AUDIO_TO_TEXT = 1236;
var wordsData = [{
    "lblWords": "Suggestions"
}];

var MyActivityResultListener = java.newClass('MyActivityResultListener', 'java.lang.Object', ['com.konylabs.ffi.ActivityResultListener'], {
    onActivityResult: function(requestCode, resultCode, intentData) {
        kony.print("SPEECH On Activity Result Called" + requestCode);
        switch (requestCode) {
        case DISPLAY_REQUEST_CODE:
            displayWordsOnRead(intentData);
            break;
        case VOICE_TO_TEXT_REQUEST_CODE:
            displayTextOnVoice(resultCode, intentData);
            break;
        case CONVERT_AUDIO_TO_TEXT:
        	var voiceText = getWordsFromVoice(resultCode, intentData);
        	kony.print("SPEECH API "+voiceText);
        	createWAVFilesFromVoice(voiceText);
        	break;
        }
    }
});

var MySpeechListner = java.newClass('MySpeechListner', 'java.lang.Object', ['android.speech.tts.TextToSpeech$OnInitListener'], {
    onInit: function(status) {
        if (status != TextToSpeech.ERROR) {
            t1.setLanguage(Locale.UK);
        }
    }
});

t1 = new TextToSpeech(context, MySpeechListner);


function displayWordsOnRead(intentData) {
    var matchesText = intentData.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
    kony.print("SPEECH matchesText.size() = " + matchesText.size());
    for (var i = 0; i < matchesText.size(); i++) {
        kony.print("SPEECH " + i + " " + matchesText.get(i));
        var words = {};
        words["lblWords"] = matchesText.get(i);
        wordsData[i + 1] = words;
    }
    kony.print("SPEECH wordsData = " + JSON.stringify(wordsData));
    speechHome.segment216664216321.data = [];
    speechHome.segment216664216321.data = wordsData;
    kony.print("SPEECH wordsData = [data added]");
}

function getWordsFromVoice(resultCode, intentData){
	kony.print("SPEECH Records "+ resultCode + ":" +VOICE_TO_TEXT_REQUEST_CODE + ":"+intentData);
    if (null != intentData) {
        var text = intentData.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
        kony.print("SPEECH Display Text: "+text);
        return text.get(0);
    }
}

function displayTextOnVoice(resultCode, intentData) {
	kony.print("SPEECH Records "+ resultCode + ":" +VOICE_TO_TEXT_REQUEST_CODE + ":"+intentData);
    speechHome.txtSpeech.text = getWordsFromVoice(resultCode, intentData);
    kony.print("SPEECH Display Text: "+getWordsFromVoice(resultCode, intentData));
}

function onItemClick(seguiWidget, sectionIndex, rowIndex, selectedState) {
    kony.print("SPEECH " + sectionIndex + " : " + rowIndex + " : " + seguiWidget + " : " + selectedState);
    var wordKey = wordsData[rowIndex];
    onClickReadText("google Searching for  " + wordKey.lblWords);
    searchWebForTheWord(wordKey.lblWords);
}

// To get google Mic to read the voice and give suggestion

function listenAndGetSuggestions() {
    kony.print("SPEECH..1 ");
    speechHome.segment216664216321.data = [{
        "lblWords": "Suggestions"
    }];
    var packManager = context.getPackageManager();
    kony.print("SPEECH..2 " + packManager);
    var intActivities = packManager.queryIntentActivities(new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH), 0);
    kony.print("SPEECH.. " + intActivities.size());
    if (intActivities.size() != 0) {
        //start the checking Intent - will retrieve result in onActivityResult
        var recgSpeechIntent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        recgSpeechIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        context.registerActivityResultListener(DISPLAY_REQUEST_CODE, new MyActivityResultListener());
        context.startActivityForResult(recgSpeechIntent, DISPLAY_REQUEST_CODE);
    } else {
        //speech recognition not supported, disable button and output message
        speechHome.speechBtn.setEnabled(false);
        positiveSelection("Oops - Speech recognition not supported!");
    }
}

//to listen to voice and convert it into text

function listenAndConvertToText(requestCode) {
    var packManager = context.getPackageManager();
    kony.print("SPEECH..2 " + packManager);
    var voiceToTextIntent = new Intent(
    RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
    voiceToTextIntent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, "en-US");
    context.registerActivityResultListener(requestCode, new MyActivityResultListener());
    context.startActivityForResult(voiceToTextIntent, requestCode);
    speechHome.txtSpeech.text = "";
}

//text to speech function
function onClickReadText(textToRead) {
    kony.print("SPEECH " + textToRead)
    var toSpeak = textToRead
    positiveSelection(toSpeak);
    t1.speak(toSpeak, TextToSpeech.QUEUE_FLUSH, null);
}

//search word suggestions
function searchWebForTheWord(textSearch){
	var search = new Intent(Intent.ACTION_WEB_SEARCH); 
	search.putExtra(SearchManager.QUERY, textSearch);
	context.startActivity(search);
}

function positiveSelection(messagetext){
 //Defining basicConf parameter for alert
 var basicConf = {message: messagetext , alertType: constants.ALERT_TYPE_INFO , yesLabel:"OK"};

 //Defining pspConf parameter for alert
 var pspConf = {};
 //Alert definition
 kony.ui.Alert(basicConf,pspConf);
 //var infoAlert = kony.ui.Alert(basicConf,pspConf);
}