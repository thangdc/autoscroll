// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
	
	chrome.storage.sync.set({isStart: false});
	chrome.storage.sync.set({timeout: 25});
	chrome.storage.sync.set({shortcut: 's'});
	
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [new chrome.declarativeContent.PageStateMatcher({
				pageUrl: {
					schemes: [ 'http', 'https']
				},
			})
			],
			actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});
});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
	
	var timeout = 25;
	var shortcut = 's';
	
	chrome.storage.sync.get('timeout', function(data) {
		timeout = data.timeout;
	});
	chrome.storage.sync.get('shortcut', function(data) {
		shortcut = data.shortcut;
	});
	
	chrome.tabs.executeScript(
		tabId,
		{	
			code: 'ThangDC = window.ThangDC || {}; if(ThangDC.isStart == false) { ThangDC.isStart = true; } else { ThangDC.isStart = false; }; ThangDC.timeout = '+ timeout +'; ThangDC.shortcut = \''+ shortcut +'\'; function start(){ ThangDC.isStart = true; if(typeof (ThangDC.timer) === \'undefined\') { ThangDC.timer = setInterval(function(){ var body = document.body, html = document.documentElement; var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight); console.log(document.documentElement.clientHeight); if ((document.documentElement.clientHeight + document.documentElement.scrollTop) < height) { if(ThangDC.isStart) { window.scrollTo(0, document.documentElement.scrollTop+1); } else { stop(); } } else { stop(); } }, ThangDC.timeout); } } function stop(){ clearInterval(ThangDC.timer); ThangDC.timer = undefined; ThangDC.isStart = false; } document.onkeypress = function(event){ if(event.which == ThangDC.shortcut.charCodeAt(0)) { if(ThangDC.isStart) { stop(); } else { start(); } } }'
		}
	);		
	
})