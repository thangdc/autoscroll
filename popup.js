let startEle = document.getElementById('btnStart');
let timeoutEle = document.getElementById('tbxTimeout');
//let shortcutEle = document.getElementById('tbxShortcut');

var isStart = false;
var timeout = 25;
var shortcut = 'z';

chrome.storage.sync.set({shortcut: shortcut});

chrome.storage.sync.get('timeout', function(data) {
	timeoutEle.value = data.timeout;
	timeout = data.timeout;
});

chrome.storage.sync.get('shortcut', function(data) {
	//shortcutEle.setAttribute('value', data.shortcut);
	shortcut = data.shortcut;
});

timeoutEle.onchange = function(element) {
	timeout = element.target.value;
	chrome.storage.sync.set({timeout: timeout});
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.executeScript(
			tabs[0].id,
			{	
				code: 'ThangDC = window.ThangDC || {}; ThangDC.timeout = '+ timeout +';'
			}
		);
	});
}

/*shortcutEle.onchange = function(element) {
	shortcut = element.target.value;
	chrome.storage.sync.set({shortcut: shortcut});
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.executeScript(
			tabs[0].id,
			{	
				code: 'ThangDC = window.ThangDC || {}; ThangDC.shortcut = \''+ shortcut +'\';'
			}
		);
	});
}*/