$(document).ready(function(){
    //HTMLを読み込んだらここに書いたことを実行します。
    // console.log("ok2")
});

$("#button1").on("click", () => {
    const saji = $('input[name="saji"]:checked').val();
    const concentrated = $('input[name="concentrated"]:checked').val();
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        saji_str: saji,
        concent_str: concentrated
      });
    });
  });

$("#reload").on("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          reload: true
        });
      });
});