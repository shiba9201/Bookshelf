$(function(){
  // AmazonAPIで検索するサーバー側にデータを渡し、返ってきたデータを表示するメソッド
  // 一文字ずつ検索してしまうことを防ぐために、入力後一定時間入力がない場合にajaxが動作するようにしている
  function search(keyword){
    if (globalTimeout != null) {
      clearTimeout(globalTimeout);
    }
    globalTimeout = setTimeout(function() {
      globalTimeout = null;
      // キーワードに入力がないときは検索せず、検索結果を非表示にする
      if (keyword === ''){
        $(`#items`).css('display','none');
        return false
      };
      $.ajax({
        url: '/search',
        type: 'GET',
        dataType: 'json',
        async: true,
        data: {keyword: keyword},
      }).done(function(data){
        $(`#items`).css('display','');
        $(`#items`).html(data.content);
      });
    }, 700); // 何ms後に検索するかはここで設定
  }

  // 入力フォームに入力があった場合にseachメソッドを呼び出す
  var globalTimeout = null;
  $('#keyword').keyup(function() {
    var keyword = $("#keyword").val();
    search(keyword);
  });
  
   // 本棚をシェアボタンが押された時に、シェア用の画像を生成する
  $("#save-button").on("click", function () {
    // 処理前にLoading 画像を表示
    dispLoading('シェア準備中');

    // 画像を識別するために、画像固有のランダムな文字列を付与
    // 生成する文字列の長さ
    var l = 8;
    // 生成する文字列に含める文字をセット
    var c = "abcdefghijklmnopqrstuvwxyz0123456789";
    var cl = c.length;
    var hash = "";
    for(var i=0; i<l; i++){
      hash += c[Math.floor(Math.random()*cl)];
    }

    // html2canvasというライブラリを使用
    html2canvas($('.preview').get(0), {
      proxy: true,
      useCORS: true
    }).then( function (canvas) {
      var imgData = canvas.toDataURL();
    });
  });
 });