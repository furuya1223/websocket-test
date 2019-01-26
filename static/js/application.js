// Support TLS-specific URLs, when appropriate.
if (window.location.protocol == "https:") {
    var ws_scheme = "wss://";
} else {
    var ws_scheme = "ws://"
};

var inbox = new ReconnectingWebSocket(ws_scheme + location.host + "/receive");
var outbox = new ReconnectingWebSocket(ws_scheme + location.host + "/submit");

inbox.onmessage = function(message) {
    var file_reader = new FileReader();
    file_reader.onloadend = function(e){
        // エラー
        if(file_reader.error) return;
        // 出力テスト
        console.log(file_reader.result); // "文字列テスト"
    };
    file_reader.readAsText(message.data);
    console.log(message.data)
    var data = message.data;
    $("#chat-text").append("<div class='panel panel-default'><div class='panel-heading'>" + $('<span/>').text(data.handle).html() + "</div><div class='panel-body'>" + $('<span/>').text(data.text).html() + "</div></div>");
    $("#chat-text").stop().animate({
        scrollTop: $('#chat-text')[0].scrollHeight
    }, 800);
};

inbox.onclose = function(){
    console.log('inbox closed');
    this.inbox = new WebSocket(inbox.url);
};

outbox.onclose = function(){
    console.log('outbox closed');
    this.outbox = new WebSocket(outbox.url);
};

$("#input-form").on("submit", function(event) {
    event.preventDefault();
    var handle = $("#input-handle")[0].value;
    var text   = $("#input-text")[0].value;
    outbox.send(JSON.stringify({ handle: handle, text: text }));
    $("#input-text")[0].value = "";
});
