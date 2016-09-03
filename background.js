var getSeasonAndEpisod = function(url) {
    if (url.indexOf('#') > -1) {
        var hash = url.substring(url.indexOf('#')+1);
        var seasonAndEpisod = hash.substring(hash.indexOf('s:'));
        return seasonAndEpisod.split("-");
    } else {
        return false;
    }
};

var getUrlWithoutHash = function(url) {
    if (url.indexOf('#') > -1) {
        urlArr = url.split('#');
    } else {
        return url;
    }
    return urlArr[0];
};

var updateHtmlObj = function(tab, htmlObj, url, fullUrl, hash) {
    var title = tab.title;
    var nameOfserial = '';

    if (title.indexOf("Смотреть сериал") === -1 || title.indexOf("онлайн бесплатно") === -1) {
      nameOfserial = title;
    } else {
      var start = title.indexOf("Смотреть сериал") + "Смотреть сериал".length;
      var end = title.indexOf("онлайн бесплатно");
      nameOfserial = title.slice(start, end);
    }

    htmlObj[url] = '<div data-id="'+url+'" class="serial">'+
                        '<a href="'+fullUrl+'" target="_blank" class="serial-title">'+nameOfserial+' | '+hash+'</a>'+
                        '<a class="serial-del-btn" href="#">(x)</a>'+
                    '</div>';

    return htmlObj;
};

var tabUpdateCallback = function(tabId, changeInfo, tab) {
    if (changeInfo.url.indexOf('hdrezka') === -1) return false;

    // second condition - we wait while a user select any episod in the player
    if (changeInfo.status === 'loading' && (changeInfo.url).indexOf('s:') > -1) {
        var fullUrl = changeInfo.url;
        var hash = getSeasonAndEpisod(changeInfo.url);
        var url = getUrlWithoutHash(changeInfo.url);

        chrome.storage.local.get('html', function(result) {
            var htmlObj = result.html;
            chrome.tabs.getSelected(null, function(tab) {
                var newHtmlObj = updateHtmlObj(tab, htmlObj, url, fullUrl, hash);
                chrome.storage.local.set({'html': newHtmlObj});
            });
        });
    }
};
chrome.tabs.onUpdated.addListener(tabUpdateCallback);
