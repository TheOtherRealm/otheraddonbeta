//
const {getMostRecentBrowserWindow} = require("sdk/window/utils");
var {Hotkey} = require("sdk/hotkeys");
var { open } = require('sdk/window/utils');
var widgets = require("sdk/widget");
var tabs = require("sdk/tabs");
var data = require("sdk/self").data;
var self = require("sdk/self");
var pageMod = require("sdk/page-mod");
var selection = require("sdk/selection");
require("sdk/tabs").on("ready", initiateContent);
var prefs = require('sdk/simple-prefs');
var browserPreferences = require("sdk/simple-storage");
var workers = require("sdk/content/worker");
//
var searchJSON = [
    {
	"id": "googleMapSearch",
	"label": "Google Maps",
	"iconURL": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAuVJREFUOI2Fk0tsVGUUx39n7r0znZlOte30MbS1nYm8O9VEqNRHMLEgNBJMVwRcuQMiiUmDbl2oidEVaYPRuDMawkIQpD7SRkoI0AS0hUKppZYJ0GkKVVuHedz7HRedGVmQ+F+dxTm/nO+X8wnAD+Nft1hoHsKUUhkGCLMl0Z0GmNy9s5C7kLIDm5rdtacHnVKfAPSfPKAr1SPR/4ruI1Nkx+4hxSZ7TQ3Dh9s5uGtA7MHhE6e2dnUT8Ad5XM7fOom5exEQPgll6HsYgvllUDg/0q+2GnEqAiFupccZHD0Kquzo3E+8Icl0aoKx6z/y0kIeAfoyIRSl8GeOmWEl2G7jA4Oq8vOVL0FBRMqghtomFFg6/S4IKIog/NJeV97QZ9RI+c0lDwqqkC8UADBVARo+3aul4dsd68sAu2xLipwiSNUwO38NFNZUW17laxut2aoAsx3rANi2dQuurwofquoaQ2/Xe9i2H8cJsKuzj6k741yYPMbuzV1e0PKs9KLDXLKN5lgd+3p7aKqrWdmg4OazX5w5xIsb9tDz7EEao22k5m4yNPY5OzqSbqVTsBcfhFla9FHY3sWrybVYahDXFB1gUODcxDfMzF9HFSzLz8ttcffJCmNjckQi96mLLtC+OYEYD/Fc8NwVgDxyMuOzZ3Acm6diT7Oqsde+fCOWf3sgQfp+hIrQ39S3zFPf+oBgJItlCkWJKs6B1/vLVu/8vp9I/fvURhN0bKj2d6Ym+PAYQDVvbcuwrnmOJ5pzmFUWU5eCWHv29b45dOPo6tGp72myTuGzw5y9vLzsadQfb6nHzecYvbmIAFemHX76tYbMPyGtCS6JyF/4PM/NgfDGeoNi9MRIa+a7S42VR45PMn07zQubViNqQARREKMMXfXLB8dbmfgjhgDxjz/b/tUzMTt89rfahW9Hoikt5LPGhzyfbIsZNxu8eO3ejJd7mBHFuBh6XnnuHYCBjw4lSrcXf+xP+v/M/AtC/zAbo5oGAwAAAABJRU5ErkJggg==",
	"tabURL": "https://www.google.com/maps/preview/search/"
    }, {
	"id": "scholarSearch",
	"label": "Google Scholar Search",
	"iconURL": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAoACgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDMJYvgFiScADqa9N8KfD6EWn2rXYTJLKPktmYgRj3x/F/KsHwdP4a0uX+0dVvN14CfKh8l2EXv05b+Veq6dqdrq1gt7YyebC+QrbSuSOOhr6PNMbWj+7pppd9vuPMwtGD96Tv5GX/wg3hr/oFxf99t/jUF14S8KWVrJc3NhBFDGu53Z2wB+dct4X8a6pceLfsepXAkt7mRo1TYB5bDOAPyxzTvitNdrPYwecRZvGzeUOhcHqfXgiuSOHxSxEaM6j113Zs6lJ03NR2Oa8VR2kGp2wsLWO2tZrdJ4lQncytnBbJ68fhmitj4jWcFpeaMIIgg+y+Xx/dQrtH4ZNFe/gZc+HjJnn1lao0cQfvH613HgLxdb6Mkmm6jJ5dq7F45T0jJ6g+xridrPJsRSzM2AAOSa7+z+HdvaaW+oeIL54FRN8kcOP3Y925yfoKzzCVD2XJW67d/kVh1U5uaHQsxeCZZ/FsGs6fcwNpUkwuldW5HfA+prB+IOtnVta+yLC8SWW6P94MFmOMn6cDFb2h+P9H00W+mLBeJp8fyJc3DBmUdsgdv5VveLvDdp4h0lryHaLuOLfDMv8YxnB9Qa8mFadHEReJi7WsmdThGdN+yfqcH441yx1u60x7GUyLDCyyZUjaSV4/Q0VyanJXjvRXv0aUaNNU47I4Jzc5czLNncPY6jb3ax7zBKsgU9Dg5r2A61ofi7Q57IXywtPHtZJCFdD9D1wfSiiuDNKEZQVb7Udjow02ny9GeeS+BdUhn8t7rThDn/j4a4AXHrjr+FdNq3i2w0Xw5Homkzm8uEgEHnAfKgAwWz3PsKKK5MNN4+a9v9n+tTSovYp8nU80VWBUYPWiiivfZwn//2Q==",
	"tabURL": "http://scholar.google.com/scholar?q="
    }, {
	"id": "imageSearch",
	"label": "Google Image Search",
	"iconURL": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAQCAYAAAD0xERiAAAABHNCSVQICAgIfAhkiAAAAJhJREFUOI2tk0sOgCAMRDuEjd7/jsYLwMY4rjSVTEGNk7CglOkrH5Ck/aSsggC6m6L66QtBVCyPEp4YnqS5Z6TaUbkAjGTcZnQuPk7yNpdmPgHANUaFpNley2XkpeY+Js3SNMvKI3XJ3gok2eK3ZzaKn2uSrDXwt7atS/iUJJki2WuxNM3dNyn/piJ8otQSfNHtO/1haGZ2ACEAVtY9WIYtAAAAAElFTkSuQmCC",
	"tabURL": "https://www.google.com/search?tbm=isch&q="
    }, {
	"id": "thesaurusSearch",
	"label": "Thesaurus Search",
	"iconURL": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAYVJREFUOI2lkyFz4zAQhb9mArZMZhYUFExZDhq2rP4Jhf0JOZhjpWX9C4ZXWJgwwxoaKixiFlPBKufkOjfTuT4kreY9vX0rXf1+aXJVAYCRiZiuv7wGWDo74W1ixtfXQxAW52r/g8W32P8SiHIL7vmy6J7BthclEcvCrZ5I/lVJBYYBzBpWPYibGfXmQiClwGIat0gaMX5L8q9KSCMMLcQ9+E7Fx8fZCYA4RCzsuibnfpXz+33Ox13OOedpCrrvV39qOWzz8X2T/8Zy9jPqLbZFpAHfqYPwRDw2GLfByL6EpPX9ELnadU1eezOLnGBbkEaziIVo1nD4BaED9B2oA9+VUA5I2hFDjwkdoP0bezcLFfJpCiowtFDdIOJJ8gPj74EtKR0KISjjFOTZFJZGJkhHCGpfzloQaZDqBsxa3fEZS33K6fNJaQEgmgeMe5xHfC5gZJp34khlziK13io1JWIiHsMsIGLVwX7UD1UbqOQUaACxhPENgGv3k9reMfYDhxjLt458ADy42M55z5iQAAAAAElFTkSuQmCC",
	"tabURL": "http://thesaurus.com/browse/"
    }, {
	"id": "bingSearch",
	"label": "Bing Search",
	"iconURL": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAUhJREFUOI2lk89KAlEUxn8zo5FlmVq4yDEzAmkjYVGZYC8QbWrRJqLa9QBt6wF6gMB15KZNQViLQGgRGYEVJZWLkAoTwj9hMOm0krJGU/xW95778eM793AENYxKExJ/Xj4UqWGArnxQgfngNHZzjsBgkllvvPEEAMm3Dg5v+upO8AcA8Jpraw5Q1tpugJ0zN4m0qapHV/UFcFiyhKJuQlE33cYCo85nxvpf8NhT9SVYnbrAoP8EIJ03cHDlYn3PVzH3mgCA4EKYcddTYy3I5hwAibSJ7dMhzh9t9QNsne+s+GNsHo1wcm+viGs1FlicuEaoBnBYsgz0ZNjY91FSv22SWGLG88Cc95ZWfVE7gQA4rRmO43KFYVhOseyP0duV12xB+L1MkTuZrYiH9haFpcnLmh+oCQBQihKSWEIU/l9UzSnopaJWWVNfebhcBlar0WQAAAAASUVORK5CYII=",
	"tabURL": "http://www.bing.com/search?q="
    }, {
	"id": "googleSearch",
	"label": "Google Search",
	"iconURL": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAZVJREFUOI2dkz9rk1EUh5/73vuGEpXqJBm0FP/h0FKrotGWkgxCFIq4OejSOrhJ9SO0S79DBJVsAVGzuAlZNCUJqEME46ImQYu2JJq0N+89XaQ25IU2PduF83vO+Z1zj5pZWk95otNKEWOAEKHuVDDn7UcMoBQxT3TahIk9BTcv+HgKrpzWjB3TvCxa3n4OWPkS9ELC6PeSEbQH2YLlUaZDpeY4fED1iLeLhQFS44ZfLQHACeTKlvgpE2olFOAExo/r7XdjXWisub0DnuQt18YMl05oDg0pEmcNy7mNvQNeFC0PnrWJHfF4vhDlw9eASm2ADgA+1R25kqXZFmYnDcNRFZqnkkv/prUjLp/UTIxoVltCNAKzkz5/NoSHmQ6rzd70vg5ux31uXfRJv9kk+87yNG+5/7iNE7g7HdndwvUJQ6EaYHes/GdTeFXqEgnZZB+g+sNx45zh6PB/z0bD+VFNrtzdfQYHhxR3rvpMnTGs/RVqvx0dC6/fd/n4rf8nqsRiq7afYwIQoeEhwbwIjcHVfEeCuS3tcZbzmPZ54QAAAABJRU5ErkJggg==",
	"tabURL": "https://www.google.com/search?q="
    }, {
	"id": "ddgSearch",
	"label": "Duck Duck Go Search",
	"iconURL": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAt5JREFUOI1lk0toVGcYhp//zDGZOlmYtosG2oBVcdFYjUMSIp2YC6YBwaorUchKiiGUmoJFSsFFoZheVBAtpdCWtolioTFYWjrRJFUoYqV1kkKaODOeRpOMMDGJZya3yZy3i/Eyie/qW/zPd31/wwqN1gcatTTXbC15B+SBMWB8kLVXdRir4LvS3nR4JfMU3u5z/6tdJffSV/KyGeUrdblTozsCGq213XzGehw4IaPCyjeLSvsWea68jukzR4m/ZoitNyQOVWMVBnglnMJfvbPICVlaVtkJWW7yk7el+TlNft6ibHL8SeX779YrtgHFN6HJE62SpOSnh+SErFwnsTp/g9O0RpI08U69nGr0jO5E5GxC8a3o/tG9kiSnqVixOn8D0W3WYKrvJ6XCnRrZgGbPt+vsZemPf8a1kMnqgaRvetN6eO6EYkE0shmlen5Uqq9L0W3WoOVlvLJA7R4e/NAONhjLR00Q9h85xy/XblMMnOkMEzWvkp01eBmL5NefEajdjbfolTG8Ndfy8BY0XIbcC6eUkdT9ezRvhoh0r0RKlkhLKPFhjvl3C7L0eJ+rfXgWTIXPYwO7atYBdyBiYLKJ+cgE0xcSjNQUMHXRBkCA7ZkcX7B+M7N//0X65vW8+5QiwMyA/8US/FVgCidI/lYJgGfAyvrocPu7KN7/HtlFWJwEzUw/SuBj6tIx7h6cYKYnQeJYgvHT8EJzG25vF55NB4NVduNQQ3HuNK2NulWCZq90Px2/56qG1qLOUJGi69Dd1l2SpKGG5zVYZTcCMBAkNna8Rdm0q3ttezT1cZu+HNun16/sUPXVnarr3yg+elkPjxyQ3LTGj7doIEhsmRsj5bjO+zmTeDeu69f5kwr8vFZvRJp1MtauL0b7JUljH+xTpJxl/+GJbgWJD1RYcru+fcaMmYvfa6jCViRIPJ8xK5PcqOClggVOmTneMh7+R7ucl5/uhUIOV/5JIv/9/8Mb4cdOmKaNAAAAAElFTkSuQmCC",
	"tabURL": "https://duckduckgo.com/?q="
    }, {
	"id": "wikipediaSearch",
	"label": "Wikipedia Search",
	"iconURL": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAdZJREFUOI2lk79LagEcxY96LbirNIUgOMuFaLFI4woqQeDa2OLmP9CfIA5B0VAQCXeNcPIPcBFUHHURLuEdi4bEH7fL5w2v7qvnGx51pu/3C+cM33OOgDhwCvT4f/TeOXG9D9/FaQToSdrV99CPvL294fu+JCkSiWhzc1OLxUKSFIvFFIvFtFqtJEkbGxsKgkBBEEiS4vG4NBwOOTw8RBKXl5cEQUCpVEISt7e3PD4+sre3R6FQwPM8Hh4eSCQSVCoVRqMRAnBdF8MwaLVaAMxmM1KpFBcXFwDYts3z8zMAy+WS/f19fN8H+C0AcHJywsHBQfid6+trkskk9/f31Ov18O44DldXV+EeCgwGAyTR7XYB8H2fdDqNZVnM5/OQcHR0xGw2C/foxzt3dnZk27YajYYkyTAMlctleZ4nwzAkSYPBQJZlyTTNPz58NrXdbhONRplMJgAcHx+ztbVFs9kEoFqt4nnelyBEAD4bm8lklM/nVS6X5bquXl5e5DiOOp2Ozs7OdHNz8zUJf0fr7u4O0zQpFossFguenp4wTZNsNku/31+L4prAarVie3ub8/Pz8Far1cjlcmvkD4G1Eo3HY4IgCPfX11em0+m/+L0fl0n8sM6/AExbyAYLHrngAAAAAElFTkSuQmCC",
	"tabURL": "https://en.wikipedia.org/w/index.php?search="
    }, {
	"id": "wiktionarySearch",
	"label": "Wiktionary Search",
	"iconURL": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAVdJREFUOI2lUzGrgmAUPS8sosU5jGgLHJxehEMI4Wr+hvb+hH+if2I2BOLsI8i1QCOwgmgSohrOW0osFHy9M517+b5zz73cC5JVkmOSPsvDf/yp4kE+xfiLpA/gG5/hByQpyzItyypd1rIsqqpKkkwFSPJ4PPJ2u5USeQpUsn663S6WyyWCIEhzp9MJ6/U6jTebzWsTWQeKojCOYzYaDR4OB5LkZDKhJElp5Xa7XexgtVqh2WxC0zTM53MAgOu6EAQBURQhCALc7/cXA0LeaE3ThG3bGA6HEEURqqrC8zzs93sYhvHytpInYBgGFosFHMeBrusYDAZwXRez2Qyj0ah4Bln0ej3KskzP8xiGIVutFkVR5OVyKZ7Bexvb7Rb9fh+dTgcAoOs66vV6voP3RUqShLvdLo3jOOb5fM5dpL8cEUnyer0+qV8BMC1qowi1Wu1Jp+A/z/kXrwE8mk9Jj8EAAAAASUVORK5CYII=",
	"tabURL": "https://en.wiktionary.org/w/index.php?search="
    }
];
//create a empty json object to hold the button toolbarwidgit objects
let searchButtons = [];
//set a bool var set to true if this is the first time the application is loading
var loading=true;
//Enable to reset browser so that updates work (potential bug?)
browserPreferences.storage.search=null;
//if this is the first time the addon is loading, populate it
if (!browserPreferences.storage.search) {
    browserPreferences.storage.search = searchJSON;
}
//this function loads the toolbar buttons from the json array
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
//if it's the first time, populate the toolbar
if(loading){
    loadButtons();
}
//this function fires when a search button is clicked
function returnURL(tabURL) {
    return function() {
	tabs.activeTab.url = tabURL + getMostRecentBrowserWindow().document.getElementById("searchbar").value;
    };
}
//////////////
//Wiki Stuff//
//   \|/    //
//load a hidden function into every page that will be populated with the wiki iframe when the key combination is typed
function initiateContent(tab) {
    tab.attach({
	contentScriptFile: [data.url("js/jquery-2.0.3.js"), data.url("js/jquery-ui.min.js")],
	contentScript: "if (document.body) { $('body').ready(function () {$('body').prepend('<div style=\"display:none;\" id=\"hiddenX\"></div><div style=\"display:none;\" id=\"hiddenY\"></div>')});};" + "$('#hiddenY').ready(function () {$(document).mousemove(function (e) {$('#hiddenX').html(e.pageX);$('#hiddenY').html(e.pageY);});});"
    });
}
//load the css files to formate the iframe overlay
pageMod.PageMod({
    include: "*",
    contentStyleFile: [data.url("css/stylsht.css"), data.url("css/jquery-ui.min.css")]
});
//create a text selection listener
selection.on('select', wikiListener);
var selectText = '';
function wikiListener() {
    if (selection.text) {
	selectText = selection.text;
    }
}
//create key press combos (default: "accel-shift-1","accel-shift-2","accel-shift-`")
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
//create functions to call the relevent data functions that load the wiki iframes
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