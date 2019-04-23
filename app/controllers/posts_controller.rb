class PostsController < ApplicationController
  def new
    @h = params[:h]
  end
  
  def search
    contents = { content: render_to_string(partial: 'posts/items.html.erb', locals: {books: search_by_amazon(params[:keyword])} )}
    render json: contents
  end 
  
  def make
    generate(to_uploaded(params[:imgData]), params[:hash])
  end 
  
  private
  
  def search_by_amazon(keyword)
    # デバッグ出力用/trueで出力
    Amazon::Ecs.debug = true
    # AmazonAPIで検索
    results = Amazon::Ecs.item_search(
      keyword,
      search_index:  'Books',
      dataType: 'script',
      response_group: 'ItemAttributes, Images',
      country:  'jp',
    )
    # 検索結果から本のタイトル,画像URL, 詳細ページURLの取得して配列へ格納
    books = []
    results.items.each do |item|
      book = {
        title: item.get('ItemAttributes/Title'),
        image: item.get('LargeImage/URL'),
        url: item.get('DetailPageURL'),
      }
      books << book
    end
    books
  end 
end