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
    date = [Rails.env]
    render :json =>date
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
  
  def to_uploaded(base64_params)
    content_type, string_data = base64_param.match(/data:(.*?);(?:.*?),(.*)$/).captures
    tempfile = Tempfile.new
    tempfile.binmode
    tempfile << Base64.decode64(string_data)
    file_param = { type: content_type, tempfile: tempfile }
    ActionDispatch::Http::UploadedFile.new(file_param)
  end 
end