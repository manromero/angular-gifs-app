import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gifs.interface';
import { GifsMapper } from '../mapper/gifs.mapper';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private http = inject(HttpClient);
  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs() {
    this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
        },
      })
      .subscribe((response) => {
        const gifs = GifsMapper.mapGiphyItemsToGifArray(response.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
      });
  }
}
