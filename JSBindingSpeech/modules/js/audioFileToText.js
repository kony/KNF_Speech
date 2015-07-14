var MediaStore = java.import('android.provider.MediaStore');
var Environment = java.import('android.os.Environment');
var Cursor = java.import('android.database.Cursor');
var Uri = java.import('android.net.Uri');
var StringClass = java.import('java.lang.String');
var Clazz = java.import('java.lang.Class');
var HashMap = java.import('java.util.HashMap');
var StaticArray = java.import('java.lang.reflect.Array');
var File = java.import('java.io.File');

//create audio file from text
function createWAVFilesFromText() {
    tts = new TextToSpeech(context, new TTSListener());
}

var OnUtteranceCompletedListener = java.newClass('OnUtteranceCompletedListener', 'java.lang.Object', ['android.speech.tts.TextToSpeech$OnUtteranceCompletedListener'], {
    onUtteranceCompleted: function(utteranceId) {
        kony.print("SPEECH AUDIO done " + utteranceId + " isSpeaking=" + tts.isSpeaking());
        tts.stop();
        positiveSelection("WAV file Location:\n" + globalFilePath);
        kony.print("SPEECH AUDIO DONE 11 ");
        go();
    }
});

var TTSListener = java.newClass('TTSListener', 'java.lang.Object', ['android.speech.tts.TextToSpeech$OnInitListener'], {
    onInit: function(status) {
        tts.setOnUtteranceCompletedListener(new OnUtteranceCompletedListener())
        kony.print("SPEECH AUDIO DONE 22 ");
        go();
    }
});

var globalVoiceText = "";

function createWAVFilesFromVoice(voiceText) {
    globalVoiceText = voiceText;
    tts = new TextToSpeech(context, new TTSListenerVoice());
}

var OnUtteranceCompletedListenerVoice = java.newClass('OnUtteranceCompletedListenerVoice', 'java.lang.Object', ['android.speech.tts.TextToSpeech$OnUtteranceCompletedListener'], {
    onUtteranceCompleted: function(utteranceId) {
        kony.print("SPEECH AUDIO done " + utteranceId + " isSpeaking=" + tts.isSpeaking());
        tts.stop();
        kony.print("SPEECH AUDIO DONE 11 ");
    }
});

var TTSListenerVoice = java.newClass('TTSListenerVoice', 'java.lang.Object', ['android.speech.tts.TextToSpeech$OnInitListener'], {
    onInit: function(status) {
        tts.setOnUtteranceCompletedListener(new OnUtteranceCompletedListenerVoice())
        kony.print("SPEECH AUDIO DONE 22 ");
        saveWAVFile("voice001", globalVoiceText, "VoiceToText")
    }
});

var curText = 0;
var texts = [];

function speechHomePostApp() {
    texts.push("Created this file based on Speech Home form, text reads ... " + speechHome.txtSpeech.text); //The java.lang.Class.newInstance() creates a new instance of the class represented by this Class object. The class is instantiated as if by a new expression with an empty argument list. The class is initialized if it has not already been initialized");
    texts.push("Duplicate of the first audio file, text reads..." + speechHome.txtSpeech.text); //The java.lang.Class.newInstance() creates a new instance of the class represented by this Class object. The class is instantiated as if by a new expression with an empty argument list. The class is initialized if it has not already been initialized");
}

function go() {
    var text
    if (curText < texts.length) {
        saveWAVFile(curText, texts[curText], curText);
        curText++;
    } else {
        kony.print("SPEECH AUDIO finished");
    }
}

var globalFilePath = "";

function saveWAVFile(fileName, text, uteranceId) {
    var params = new HashMap();
    params.put(Engine.KEY_PARAM_UTTERANCE_ID, "" + curText);
    var dir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_MUSIC);
    dir.mkdirs();
    globalFilePath = dir;
    kony.print("SPEECH AUDIO synthesizing " + text.substring(0, 50) + "...");
    if (tts.synthesizeToFile(text, params, dir + "/tts" + fileName + ".wav") != TextToSpeech.SUCCESS) {
        kony.print("Exception Occured");
    }
}