const cookpad_URL = "cookpad.com/recipe";
const delishkitchen_URL = "delishkitchen.tv/recipes";
const kurashiru_URL = "kurashiru.com/recipes";
const rakuten_URL = "recipe.rakuten.co.jp/recipe";
const nadia_URL = "nadia.com"

$("#button1").on("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (e) => {
    var url = e[0].url;
    if (url.indexOf(cookpad_URL)!=-1) {
      make_message("cookpad");
    }else if (url.indexOf(delishkitchen_URL)!=-1) {
      make_message("delishkitchen");
    }else if (url.indexOf(kurashiru_URL)!=-1) {
      make_message("kurashiru");
    }else if (url.indexOf(rakuten_URL)!=-1) {
      make_message("rakuten");
    }/*else if (url.indexOf(nadia_URL)!=-1) {
      make_message("nadia");
    }*/else{
      return;
    }
  });
  });

$("#reload").on("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var url = tabs[0].url;
      if (url.indexOf(cookpad_URL)==-1 && url.indexOf(delishkitchen_URL)==-1 && url.indexOf(kurashiru_URL)==-1 
      && url.indexOf(rakuten_URL)==-1 && url.indexOf(nadia_URL)==-1) {
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