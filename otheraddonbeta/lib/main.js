const {getMostRecentBrowserWindow} = require("sdk/window/utils");
    var {Hotkey} = require("sdk/hotkeys");
    var { open } = require('sdk/window/utils');
    /*something*/

    var widgets = require("sdk/widget");
var tabs = require("sdk/tabs");
var data = require("sdk/self").data;
var self = require("sdk/self");
var window;
var pageMod = require("sdk/page-mod");
var selection = require("sdk/selection");
require("sdk/tabs").on("ready", initiateContent);
var prefs = require('sdk/simple-prefs');
var wikiEPrefs = prefs.prefs["keyWikiPedia"];
var wikiDPrefs = prefs.prefs["keyWikTionary"];
var closeWikiPrefs = prefs.prefs["keyHide"];
var browserPreferences = require("sdk/simple-storage");
var workers = require("sdk/content/worker");
var searchJSON = [
    {
	"id": "googleSearch",
	"label": "Google Search",
	"iconURL": "https://www.google.com/favicon.ico",
	"tabURL": "https://www.google.com/search?q="
    }, {
	"id": "googleMapSearch",
	"label": "Google Maps",
	"iconURL": "https://maps.gstatic.com/favicon3.ico",
	"tabURL": "https://www.google.com/maps/preview/search/"
    }, {
	"id": "ddgSearch",
	"label": "Duck Duck Go Search",
	"iconURL": "https://duckduckgo.com/favicon.ico",
	"tabURL": "https://duckduckgo.com/?q="
    }, {
	"id": "imageSearch",
	"label": "Google Image Search",
	"iconURL": "data:image/gif;base64,R0lGODlhEgANAOMKAAAAABUVFRoaGisrKzk5OUxMTGRkZLS0tM/Pz9/f3////////////////////////yH5BAEKAA8ALAAAAAASAA0AAART8Ml5Arg3nMkluQIhXMRUYNiwSceAnYAwAkOCGISBJC4mSKMDwpJBHFC/h+xhQAEMSuSo9EFRnSCmEzrDComAgBGbsuF0PHJq9WipnYJB9/UmFyIAOw==",
	"tabURL": "https://www.google.com/search?tbm=isch&q="
    }, {
	"id": "bingSearch",
	"label": "Bing Search",
	"iconURL": "http://bing.com/favicon.ico",
	"tabURL": "http://www.bing.com/search?q="
    }, {
	"id": "thesaurusSearch",
	"label": "Thesaurus Search",
	"iconURL": "http://static.sfdict.com/thescloud/favicon.ico",
	"tabURL": "http://thesaurus.com/browse/"
    }, {
	"id": "wikipediaSearch",
	"label": "Wikipedia Search",
	"iconURL": "https://bits.wikimedia.org/favicon/wikipedia.ico",
	"tabURL": "https://en.wikipedia.org/w/index.php?search="
    }, {
	"id": "wiktionarySearch",
	"label": "Wiktionary Search",
	"iconURL": "https://bits.wikimedia.org/favicon/wiktionary/en.ico",
	"tabURL": "https://en.wiktionary.org/w/index.php?search="
    }
];
var indexOf = function(needle) {
    if(typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                if(this[i] === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }
    return indexOf.call(this, needle);
};
var searchButtons = [];
var loading=true;
///// Enable to reset browser prefs ///////
//browserPreferences.storage.search=null;//
///////////////////////////////////////////
if (!browserPreferences.storage.search) {
    browserPreferences.storage.search = searchJSON;
}
function loadButtons() {
    for (var i = 0; i < browserPreferences.storage.search.length; i++) {
	if (searchButtons[i]) {
	    searchButtons[i].destroy();
	}
	searchButtons[i] = require("toolbarwidget").ToolbarWidget({
	    toolbarID: "nav-bar", // <-- Place widget on Navigation bar
	    id: browserPreferences.storage.search[i].id,
	    label: browserPreferences.storage.search[i].label,
	    contentURL: browserPreferences.storage.search[i].iconURL,
	    onClick: returnURL(browserPreferences.storage.search[i].tabURL)
	});
    }
    loading = false;
}
if(loading){
    loadButtons();
}
function returnURL(tabURL) {
    return function() {
	tabs.activeTab.url = tabURL + getMostRecentBrowserWindow().document.getElementById("searchbar").value;
    };
}
//////////////
//Wiki Stuff//
//   \|/    //
function initiateContent(tab) {
    tab.attach({
	contentScriptFile: [data.url("js/jquery-2.0.3.js"), data.url("js/jquery-ui.min.js")],
	contentScript: "if (document.body) { $('body').ready(function () {$('body').prepend('<div style=\"display:none;\" id=\"hiddenX\"></div><div style=\"display:none;\" id=\"hiddenY\"></div>')});};" + "$('#hiddenY').ready(function () {$(document).mousemove(function (e) {$('#hiddenX').html(e.pageX);$('#hiddenY').html(e.pageY);});});"
    });
}

pageMod.PageMod({
    include: "*",
    contentStyleFile: [data.url("css/stylsht.css"), data.url("css/jquery-ui.min.css")]
});
selection.on('select', wikiListener);
var selectText = '';
function wikiListener() {
    if (selection.text) {
	selectText = selection.text;
    }
}//"accel-shift-1","accel-shift-`","accel-shift-2"data.url("css/btnForTheAddon.css"),data.url("css/jquery-ui.min.css"),  
var showHotKeyE = Hotkey({
    combo: prefs.prefs["keyWikiPedia"],
    onPress: function() {
	triggerWikiPedia();
    }
});
var showHotKeyD = Hotkey({
    combo: prefs.prefs["keyWikTionary"],
    onPress: function() {
	triggerWikTionary();
    }
});
var hideHotKey = Hotkey({
    combo: prefs.prefs["keyHide"],
    onPress: function() {
	triggerWikiClose();
    }
});
function triggerWikiPedia() {
    worker = tabs.activeTab.attach({
	contentStyleFile: [data.url("css/stylsht.css"), data.url("css/jquery-ui.min.css")],
	contentScriptFile: [data.url("getWiki.js"), data.url("js/jquery-2.0.3.js"), data.url("js/jquery-ui.min.js"), data.url("js/less-1.3.3.min.js")]
    });
    worker.port.emit("getSelectedPedia");
}
function triggerWikTionary() {
    worker = tabs.activeTab.attach({
	contentStyleFile: [data.url("css/stylsht.css"), data.url("css/jquery-ui.min.css")],
	contentScriptFile: [data.url("getWiki.js"), data.url("js/jquery-2.0.3.js"), data.url("js/jquery-ui.min.js"), data.url("js/less-1.3.3.min.js")]
    });
    worker.port.emit("getSelectedTionary");
}
function triggerWikiClose() {
    worker.port.emit("removeSelected");
}