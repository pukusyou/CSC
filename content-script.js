/**
 * 小さじ1あたりのグラム 
 */
var seasoning ={"水": 5, "酒,ワイン": 5, "酢":5,"醤油,しょうゆ":6,"みりん":6,"みそ,味噌":6,"塩":6,"砂糖":3,"水飴":7,"蜂蜜,はちみつ":7,
"メープルシロップ":7,"マーマレード":7,"油,オリーブオイル":4,"バター":4,"マーガリン":4,"ラード":4,"小麦粉":3,"米粉":3,"片栗粉,薄力粉":3,
"ベーキングパウダー":4,"重曹":4,"パン粉":1,"オートミール":2,"粉チーズ":2,"ごま":3,"ねりごま":6,"マヨネーズ":4,"牛乳":5,
"ヨーグルト":5,"生クリーム":5,"トマトピューレ,トマトペースト":5.5,"ケチャップ":6,"ウスターソース":6,"中濃ソース":7, "ドレッシング":5,
"わさび粉":2,"わさび":5,"カレー粉":2,"からし粉":2,"からし":5,"マスタード":5,"胡椒,コショー,こしょう":2,"豆板醤":7,"甜麺醤":7,"コチュジャン":7,
"オイスターソース":6,"ナンプラー":6,"脱脂粉乳":2,"粉ゼラチン":3,"粉寒天":1,"めんつゆ,麺つゆ":6,"ポン酢":6,"焼肉のたれ":6,"味の素":4,
"顆粒だし,顆粒和風だし":3,"抹茶":2,"紅茶":2,"ココア":2,"コーヒー":2,"昆布茶":2,"コンソメ":4,"鶏がら":2.5,"ガーリックパウダー":2,"タイム":2,
"白だし,白出汁":5};

/**
 * mainとなる処理
 * saji: どのボタンを選択したか
 * web: どのレシピサイトか
 */
chrome.runtime.onMessage.addListener(function(msg) {
  var saji = msg.saji_str;
  var web = msg.web_str;
  var ingredient_list,ingredient_amount = "";
    switch (web) {
      case "cookpad":
        ingredient_list=".ingredient_row";
        ingredient_amount=".ingredient_quantity.amount"
        break;
      case "delishkitchen":
        ingredient_list=".ingredient";
        ingredient_amount=".ingredient-serving"
        break;
      case "kurashiru":
        ingredient_list=".ingredient-list-item";
        ingredient_amount=".ingredient-quantity-amount"
        break;
      case "rakuten":
        ingredient_list=".recipe_material__item";
        ingredient_amount=".recipe_material__item_serving"
        break;
      // case "nadia":
      //   ingredient_list="li";
      //   ingredient_amount=".IngredientsList_amount__31Tb6"
      //   break;  
      default:
        break;
    }
    if(saji=="g"){
      // if (web=="nadia") {
      //   spoon2grams_nadia(ingredient_list,ingredient_amount);
      // }else{
        spoon2grams(ingredient_list,ingredient_amount);
      // }
    }else if (saji=="s") {
      table2tea(ingredient_amount);
    }else if (saji=="b") {
      tea2table(ingredient_amount);
    }
});

/**
 * さじ表記からグラムに書き換えます
 * @param {*} ingredient_list 材料のリストを表すクラス
 * @param {*} ingredient_amount 材料の量を表すクラス
 */
function spoon2grams(ingredient_list, ingredient_amount){
  $(ingredient_list).each(function(index, element) {
    var child = $(element).children();
    for (let key in seasoning){
      key.split(",").forEach(sina => {
        if($(child[0]).text().indexOf(sina)!=-1){
          if ($(element).find(ingredient_amount).text().indexOf("大さじ")!=-1) {
            var tablespoon_num = value_generalizate(getTablespoon_value($(element).find(ingredient_amount).text()));
            var grams = tablespoon_num * 3.0 * seasoning[key];
            grams = round(grams);
            $(element).find(ingredient_amount).html(grams + "g");
          }else if ($(element).find(ingredient_amount).text().indexOf("小さじ")!=-1) {
            var teaspoon_num = value_generalizate(getTeaspoon_value($(element).find(ingredient_amount).text()));
            var grams = teaspoon_num * seasoning[key];
            grams = round(grams);
            $(element).find(ingredient_amount).html(grams + "g");
          }
        }
      });
    }  
  })
}

/**
 * さじ表記からグラムに書き換えます
 * @param {*} ingredient_list 材料のリストを表すクラス
 * @param {*} ingredient_amount 材料の量を表すクラス
 */
function spoon2grams_nadia(ingredient_list, ingredient_amount){
  // console.log($(".IngredientsList_list__1jDm2").children().find(".IngredientsList_ingredient__3wBu0").text());
  // $(".IngredientsList_list__1jDm2").children().each(function(index, element) {
  //   console.log($(element).find(".IngredientsList_ingredient__3wBu0").text());
  // });

  $(".IngredientsList_list__1jDm2").children().each(function(index, element) {
    var child = $(element).children();
    for (let key in seasoning){
      key.split(",").forEach(sina => {
        if($(child[0]).text().indexOf(sina)!=-1){
          if ($(element).find(ingredient_amount).text().indexOf("大さじ")!=-1) {
            var tablespoon_num = value_generalizate(getTablespoon_value($(element).find(ingredient_amount).text()));
            var grams = tablespoon_num * 3.0 * seasoning[key];
            grams = round(grams);
            $(element).find(ingredient_amount).html(grams + "g");
          }else if ($(element).find(ingredient_amount).text().indexOf("小さじ")!=-1) {
            var teaspoon_num = value_generalizate(getTeaspoon_value($(element).find(ingredient_amount).text()));
            var grams = teaspoon_num * seasoning[key];
            grams = round(grams);
            $(element).find(ingredient_amount).html(grams + "g");
          }
        }
      });
    }  
  })
}

/**
 * 小さじの値を返します
 * @param {*} value 抜き出す素のテキスト
 * @returns 値(文字列)
 */
function getTeaspoon_value(value) {
  value = zenkaku2Hankaku(value);
  var pattern = /小さじ(.*)/u;
  return value.match(pattern)[1];
}

/**
 * 大さじの値を返します
 * @param {*} value 抜き出す素のテキスト
 * @returns 値(文字列)
 */
function getTablespoon_value(value) {
  value = zenkaku2Hankaku(value);
  var pattern = /大さじ(.*)/u;
  return value.match(pattern)[1];
}

/**
 * 小さじから大さじ表記に書き換えます
 * @param {*} ingredient_amount 材料の量を表すクラス
 */
function tea2table(ingredient_amount) {
  $(ingredient_amount).each(function(index,element){
  var value = $(element).html();
  value = zenkaku2Hankaku(value);
  if (value.indexOf('小さじ')!=-1) {
    var pattern = /小さじ(.*)/u;
    var teaspoon = value.match(pattern);
    if (teaspoon[1].indexOf('〜')!=-1) {
      var result = [];
      var tilde_teaspoon = teaspoon[1].split('〜');
      tilde_teaspoon.forEach(element => {
        result.push(round(value_generalizate(element) / 3));
      });
      return $(element).html("大さじ" + result[0] + "〜" + result[1]);
    }else{
      var teaspoon_num = value_generalizate(teaspoon[1]);
      var result = teaspoon_num / 3;
      result = round(result);
      return $(element).html("大さじ" + result);
    }
  }
}
)};

/**
 * 大さじから小さじ表記に書き換えます
 * @param {*} ingredient_amount 材料の量を表すクラス
 */
function table2tea(ingredient_amount) {
  $(ingredient_amount).each(function(index,element){
  var value = $(element).html();
  value = zenkaku2Hankaku(value);
  if (value.indexOf('大さじ')!=-1) {
    var pattern = /大さじ(.*)/u
    var tablespoon = value.match(pattern);
    if (tablespoon[1].indexOf('〜')!=-1) {
      var result = [];
      var tilde_tablespoon = tablespoon[1].split('〜');
      tilde_tablespoon.forEach(element => {
        result.push(round(value_generalizate(element) * 3));
      });
      return $(element).html("小さじ" + result[0] + "〜" + result[1]);
      }else{
        var tablespoon_num = value_generalizate(tablespoon[1]);
        var result = tablespoon_num * 3;
        result = round(result);
        return $(element).html("小さじ" + result);
      }
  }
}
)};

/**
 * 少数第一位で四捨五入します
 * @param {*} value 四捨五入する数値
 * @returns 四捨五入後の数値
 */
function round(value) {
  var result = value * 10.0;
  result = Math.round(result);
  result = result / 10.0;
  return result;
}

/**
 * 様々な表記を少数表示に変換します
 * @param {*} param 一般化前の数値
 * @returns 一般化後の数値(少数)
 */
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
    if (param.indexOf('/')!=-1) {
      var split_value = param.split("/");
      result = result + (parseFloat(split_value[0]) / parseFloat(split_value[1]));
    }else{
      result = result + parseFloat(param);
    }
  }
  return result;
}

/**
 * 全角を半角にします
 * @param {*} str 半角にしたい文字
 * @returns 半角の文字列
 */
function zenkaku2Hankaku(str) {
  // return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
    return str.replace(/[！-～]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}