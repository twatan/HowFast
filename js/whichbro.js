
(function(){var p=[],w=window,d=document,e=f=0;p.push('ua='+encodeURIComponent(navigator.userAgent));e|=w.ActiveXObject?1:0;e|=w.opera?2:0;e|=w.chrome?4:0;
e|='getBoxObjectFor' in d || 'mozInnerScreenX' in w?8:0;e|=('WebKitCSSMatrix' in w||'WebKitPoint' in w||'webkitStorageInfo' in w||'webkitURL' in w)?16:0;
e|=(e&16&&({}.toString).toString().indexOf("\n")===-1)?32:0;p.push('e='+e);f|='sandbox' in d.createElement('iframe')?1:0;f|='WebSocket' in w?2:0;
f|=w.Worker?4:0;f|=w.applicationCache?8:0;f|=w.history && history.pushState?16:0;f|=d.documentElement.webkitRequestFullScreen?32:0;f|='FileReader' in w?64:0;
p.push('f='+f);p.push('r='+Math.random().toString(36).substring(7));p.push('w='+screen.width);p.push('h='+screen.height);var s=d.createElement('script');
s.src='http://192.168.10.5/lib/whichbrowser/detect.php?' + p.join('&');d.getElementsByTagName('head')[0].appendChild(s);})();
// 'http://192.168.10.5/whichbrowser/detect.php?'
//http://www.cogsci.nl/czielinski/whichbrowser/detect.php?

// Get user info

/*function waitForWhichBrowser(cb) {
	var callback = cb;
	alert(callback)
	function wait() {
		if (typeof WhichBrowser == 'undefined')
			window.setTimeout(wait, 100)
		else
			callback();
	}
	wait();
}

waitForWhichBrowser(function() {
	try {
		Browsers = new WhichBrowser({
		useFeatures: true,
		detectCamouflage: true
		});
//	alert(Browsers.os.name);
	} catch (e) {
		
	}
});*/

