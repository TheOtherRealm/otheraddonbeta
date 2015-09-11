//The Other Addon by Aaron E-J is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.
//See <a xmlns:dct="http://purl.org/dc/terms/" href="http://otherrealm.org" rel="dct:source">http://otherrealm.org</a>.
var selObj = '';
//create overlays that are populated with the wiki iframe when the key combinations are pressed
self.port.on("getSelectedPedia", function() {
    selObj = window.getSelection();
	var wHeight=$( window ).height();
    $('body').prepend('<div class="wikiAddonDivRap" id="wikiAddonDivRap" style="position: fixed;  top:20px;left:20px">' +
	'<div class="btnForTheAddon btn-large IconBtnForTheAddon" type="button" style="padding: 5px;font-family: Arial, Helvetica, sans-serif; font-size: 30px;" id="moveIconBtn"> + </div>' +
	'<a href="javascript:" onclick="closeWiki()"><div type="button" class="btnForTheAddon btn-large IconBtnForTheAddon" style="padding: 5px; font-size: 25px;font-family: Arial, Helvetica, sans-serif;" id="removeIconBtn"> x </div></a>' +
	'<iframe id="wikiFrameContent" style="" src="https://en.wikipedia.org/wiki/Special:Search/' + selObj + '"></iframe>' +
	'</div>');
    $(function() {
	$("#wikiAddonDivRap").draggable();
	$("#wikiAddonDivRap").resizable();
	$('#removeIconBtn').click(function() {
	    $(this).parent().parent().remove();
	});
    });
});
self.port.on("getSelectedTionary", function() {
    selObj = window.getSelection();
    $('body').prepend('<div class="wikiAddonDivRap" id="wikiAddonDivRap" style="position: fixed;  top:20px;left:20px">' +
	'<div class="btnForTheAddon btn-large IconBtnForTheAddon" type="button" style="padding: 5px;font-family: Arial, Helvetica, sans-serif; font-size: 30px;" id="moveIconBtn"> + </div>' +
	'<a href="javascript:" onclick="closeWiki()"><div type="button" class="btnForTheAddon btn-large IconBtnForTheAddon" style="padding: 5px; font-size: 25px;font-family: Arial, Helvetica, sans-serif;" id="removeIconBtn"> x </div></a>' +
	'<iframe id="wikiFrameContent" style="" src="https://en.wiktionary.org/wiki/Special:Search/' + selObj + '"></iframe>' +
	'</div>');
    $(function() {
	$('#wikiAddonDivRap').on('onload', 'ready', 'change', function() {
	    var wikiZIndex = $(this).css('z-index');
	    wikiZIndex++;
	    $(this).css('z-index', wikiZIndex);
	    console.log($(this).css('z-index'));
	});
	$("#wikiAddonDivRap").draggable();
	$("#wikiAddonDivRap").resizable();
	$('#removeIconBtn').click(function() {
	    $(this).parent().parent().remove();
	});
    });
});
//remove the iframe when the key combinations are pressed
self.port.on('removeSelected', function() {
    closeWiki();
});
closeWiki=function () {
    $('#wikiAddonDivRap').remove();
}
//this gets the currser location and sends it to main.js
self.port.on('show', function() {
    var x = window.screenX;
    var y = window.screenY;
    self.port.emit("windowSize", x, y);
});