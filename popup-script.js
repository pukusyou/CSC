$("#button1").on("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (e) => {
    var url = e[0].url;
    if (url.indexOf("cookpad.com")!=-1) {
      make_message("cookpad");
    }else if (url.indexOf("delishkitchen")!=-1) {
      make_message("delishkitchen");
    }else{
      return;
    }
  });
  });

$("#reload").on("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var url = tabs[0].url;
      console.log(url.indexOf("cookpad.com")==-1 && url.indexOf("delishkitchen")==-1);
      if (url.indexOf("cookpad.com")==-1 && url.indexOf("delishkitchen")==-1) {
        return;
      }else{
        chrome.tabs.reload(tabs[0].id);
      }
      });
});

function make_message(web) {
  const saji = $('input[name="saji"]:checked').val();
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      saji_str: saji, 
      web_str: web
    });
    return;
  });
}