class PostsController < ApplicationController
  def new
    @h = params[:h]
  end
end