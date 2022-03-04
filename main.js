/*テキストボックスに入力した文字を取得
-----------------------------------------------------------------*/
let text;
$(function() {
    $('#input_btn').click(function() {
        text = $('#input_message').val();
        $('#output_message').text('入力しました：' + text);
    });
});

/*入力した文字を読み上げる(音声合成)
-----------------------------------------------------------------*/
//発話機能をインスタンス化
let msg = new SpeechSynthesisUtterance();

function speak(text) {
    // 以下オプション設定
    msg.lang = "ru-RU";//ロシア語
    msg.volume = 1.0; // 音量 min 0 ~ max 1
    msg.rate = 1.0; // 速度 min 0.5 ~ max 3.5
    msg.pitch = 1.0; // 音程 min 0 ~ max 2
    msg.text = text; // 喋る内容

    // 発話実行
    speechSynthesis.speak(msg);
}

/*ボタンをクリックした時
-----------------------------------------------------------------*/
//3回読み上げる
$('#speak_btn').click(function() {
    for (let i = 0; i < 3; i++) {
        speak(text);
    }
});

//説明を表示する
$('#ex_btn').click(function() {
    Swal.fire({
        title: '読み上げ機能について',
        icon: 'info',
        html: '①ロシア語を入力<br>②決定を押す<br>③「読み上げ」ボタンを押す',
        confirmButtonText: '次へ',
    }).then((result) => {
        if(result.isConfirmed) {
        Swal.fire({
            icon: 'info',
            title: '発音チェックについて',
            html: '①読み上げ機能を試す<br>②マイクのアイコンをクリック<br>③テキストボックスに入力した言葉を発音する<br>④上手く言えたらオウム返しされる'
        })
    }})
});

/*発音チェック機能(音声認識/Chrome)
-----------------------------------------------------------------*/
let rec = new webkitSpeechRecognition();
const resultDiv = document.querySelector("#result_div");
const micDiv = document.querySelector("#mic");
let stopped = true;
rec.continuous = true;
rec.interimResults = false;
rec.lang = "ru-RU";

micDiv.onclick = function () {
  if (stopped == true) {
    stopped = false;
    resultDiv.innerHTML = "";
    rec.start();
  } else {
    stopped = true;
    rec.stop();
  }
};

rec.onstart = function () {
  console.log("on start");
  micDiv.setAttribute("src", "micon.svg");
  speakingtime = 0;
};

rec.onend = function () {
  console.log("on end");
  micDiv.setAttribute("src", "micoff.svg");
  if (stopped == false) {
    setTimeout(function () {
      rec.start();
    }, speakingtime());
  }
};

//マイクが音声を認識した時の処理
rec.onresult = function (e) {
  rec.stop();
  for (let i = e.resultIndex; i < e.results.length; i++) {
    if (e.results[i].isFinal) {
      console.log(e);
      let russian = e.results[i][0].transcript;
      resultDiv.innerHTML = russian;
      russian = dialogue(russian);
      console.log(russian);
      speakingtime = text.length * 200;
      console.log("estimate:", speakingtime, "ms");
      speak(russian);
    }
  }
};

//発音の判定(認識した音声が入力したテキストと一致するかどうか)
function dialogue(input) {
  console.log("入力：" + text);
  console.log("発音：" + resultDiv.innerHTML);
  if ((resultDiv.innerHTML = text)) {
    return resultDiv.innerHTML;
  } else {
    return "Что Вы сказали?"; //意味：何とおっしゃいましたか？
  }
}

// 発話機能をインスタンス化
let res = new SpeechSynthesisUtterance();
//オウム返し
function speak(russian) {
  res.volume = 1.0; // 音量 min 0 ~ max 1
  res.rate = 1.0; // 速度 min 0 ~ max 10
  res.pitch = 1.0; // 音程 min 0 ~ max 2
  res.text = russian; // 喋る内容
  res.lang = "ru-RU"; //ロシア語に設定

  // 発話実行
  speechSynthesis.speak(res);
}

// 終了時の処理
res.onend = function (event) {
  console.log("END");
};

