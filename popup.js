let startEle = document.getElementById('btnStart');
let timeoutEle = document.getElementById('tbxTimeout');
let shortcutEle = document.getElementById('tbxShortcut');

var isStart = false;
var timeout = 25;
var shortcut = 's';

chrome.storage.sync.get('timeout', function(data) {
	timeoutEle.value = data.timeout;
});

chrome.storage.sync.get('shortcut', function(data) {
	shortcutEle.setAttribute('value', data.shortcut);
});

startEle.onclick = function(element) {
    
	if(isStart == true){
		isStart = false;
	}
	else {
		isStart = true;
	}
	
	timeout = timeoutEle.value;
	shortcut = shortcutEle.value;
	
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.executeScript(
			tabs[0].id,
			{	
				code: 'ThangDC = window.ThangDC || {}; if(ThangDC.isStart) { ThangDC.isStart = false } else { ThangDC.isStart = true; }; ThangDC.timeout = '+ timeout +'; ThangDC.shortcut = \'' + shortcut + '\'; ThangDC.isPause = false; if(typeof (ThangDC.timer) === \'undefined\') { ThangDC.timer = setInterval(function(){ if ((window.innerHeight + document.documentElement.scrollTop) < document.body.clientHeight) { if(ThangDC.isStart) { if(ThangDC.isPause == false) { window.scrollTo(0, document.documentElement.scrollTop+1); } } else { clearInterval(ThangDC.timer); ThangDC.timer = undefined; ThangDC.isStart = false; ThangDC.isPause = false; } } else { clearInterval(ThangDC.timer); ThangDC.timer = undefined; ThangDC.isStart = false; ThangDC.isPause = false; } }, ThangDC.timeout); } document.onkeypress = function(event){ if(event.which == ThangDC.shortcut.charCodeAt(0)) { if(ThangDC.isPause) { ThangDC.isPause = false; } else { ThangDC.isPause = true; } } }'
			}
		);
	});
};

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

shortcutEle.onchange = function(element) {
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
}