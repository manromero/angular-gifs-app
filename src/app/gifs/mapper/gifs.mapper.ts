import { Gif } from '../interfaces/gifs.interface';
import { GiphyItem } from '../interfaces/giphy.interfaces';

export class GifsMapper {
  static mapGiphyItemToGif(item: GiphyItem): Gif {
    return {
      id: item.id,
      title: item.title,
      url: item.images.original.url,
    };
  }

  static mapGiphyItemsToGifArray(items: GiphyItem[]): Gif[] {
    return items.map(this.mapGiphyItemToGif);
  }
}
