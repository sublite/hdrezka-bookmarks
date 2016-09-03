$(document).ready(function(){
    chrome.storage.local.get('html', function(result) {
        var htmlObj = result.html;
        render(htmlObj);
    });
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    render(changes.html.newValue);
});

var render = function(htmlObj) {
    var html = '';
    if (Object.keys(htmlObj).length >= 1) { // if object is not empty
        for (var serial in htmlObj) {
            html += htmlObj[serial];
        }
        $('.content').html(html);
    } else {
        $('.content').html('пусто :(');
    }
    $('.serial .serial-del-btn').on('click', removeSerial);
};

var removeSerial = function() {
    var that = this;
    chrome.storage.local.get('html', function(result) {
        var htmlObj = result.html;
        var url = $(that).parent().attr('data-id');
        delete htmlObj[url];
        chrome.storage.local.set({'html': htmlObj});
    });
};
