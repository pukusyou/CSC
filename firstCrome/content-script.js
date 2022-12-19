var saji;
var concentrated;

chrome.runtime.onMessage.addListener(function(msg) {
  if (msg.reload) {
    location.reload();
    return;
  }
  $(".ingredient_quantity.amount").each(function(){
    saji = msg.saji_str;
    concentrated = msg.concent_str;
    console.log(saji + ", " + concentrated);
    var value = $(this).html();
    console.log(value)
    if(!value) {
        return true;
    }
    
    if(value.indexOf('大さじ') != -1 || value.indexOf('小さじ') != -1) {
      console.log(value);
      $(this).html(sajiChanger(value));
    }
    
    
});
});

$(document).ready(function(){
    getIngredients();
});


function getIngredients(){
  $(".ingredient_row").each(function(index, element) {
    var child = $(element).children();
    console.log($(child).has(".name").text());
    console.log($(child).has(".name").text().indexOf("ツナ")!=-1);
    if($(child).has(".name").text().indexOf("ツナ")!=-1){
      console.log($(element).find(".ingredient_quantity.amount"));
      $(element).find(".ingredient_quantity.amount").html("ツナ");
    }
  })
  
}


function sajiChanger(value) {
  if (value.indexOf('小さじ')!=-1 && saji=="b") {
    var pattern = /小さじ(.*)/u;
    var teaspoon = value.match(pattern);
    if (teaspoon[1].indexOf('〜')!=-1) {
      var result = [];
      var tilde_teaspoon = teaspoon[1].split('〜');
      tilde_teaspoon.forEach(element => {
        result.push(round(value_generalizate(element) / 3));
      });
      console.log(result);
      return "大さじ" + result[0] + "〜" + result[1];
    }else{
      var teaspoon_num = value_generalizate(teaspoon[1]);
      var result = teaspoon_num / 3;
      result = round(result);
      return "大さじ" + result;
    }
  }else if (value.indexOf('大さじ')!=-1 && saji=="s") {
    var pattern = /大さじ(.*)/u
    var tablespoon = value.match(pattern);
    if (tablespoon[1].indexOf('〜')!=-1) {
      var result = [];
      var tilde_tablespoon = tablespoon[1].split('〜');
      tilde_tablespoon.forEach(element => {
        result.push(round(value_generalizate(element) * 3));
      });
      console.log(result);
      return "大さじ" + result[0] + "〜" + result[1];
      }else{
        var tablespoon_num = value_generalizate(tablespoon[1]);
        var result = tablespoon_num * 3;
        result = round(result);
        return "小さじ" + result;
      }
  }
}

function round(value) {
  var result = value * 10;
  result = Math.round(result);
  result = result / 10;
  return result;
}

function value_generalizate(param) {
  var result = 0.0;
  if (param.indexOf('と')!= -1) {
    var value = param.split("と");
    value.forEach(element => {
      if (element.indexOf('/')!=-1) {
        var split_value = element.split("/");
        result = result + (parseFloat(split_value[0]) / parseFloat(split_value[1]));
      }else{
        result = result + parseFloat(element);
      }
    });
  }else{
    result = parseFloat(param);
  }
  return result;
}
