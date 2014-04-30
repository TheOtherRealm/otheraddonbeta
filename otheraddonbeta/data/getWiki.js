var selObj = '';
//create overlays that are populated with the wiki iframe when the key combinations are pressed
self.port.on("getSelectedPedia", function() {
	selObj = window.getSelection();
	$('body').prepend('<div class="wikiAddonDivRap" id="wikiAddonDivRap" style="position: absolute;  top:' + $('#hiddenY').html() + 'px;left:' + $('#hiddenX').html() + 'px"">' +
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
	$('body').prepend('<div class="wikiAddonDivRap" id="wikiAddonDivRap" style="position: absolute;  top:' + $('#hiddenY').html() + 'px;left:' + $('#hiddenX').html() + 'px"">' +
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
function closeWiki() {
	$('#wikiAddonDivRap').remove();
}
//this gets the currser location and sends it to main.js
self.port.on('show', function() {
	var x = window.screenX;
	var y = window.screenY;
	self.port.emit("windowSize", x, y);
});