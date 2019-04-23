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
});