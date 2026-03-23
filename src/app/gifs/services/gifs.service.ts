import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, effect } from '@angular/core';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import type { Gif } from '../interfaces/gifs.interface';
import { GifsMapper } from '../mapper/gifs.mapper';
import { map, tap } from 'rxjs';

const LOCAL_STORAGE_KEY = 'gifs_search_history';

function loadSearchHistoryFromLocalStorage() {
  const searchHistoryRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
  const searchHistory = searchHistoryRaw ? JSON.parse(searchHistoryRaw) : {};
  return searchHistory;
}

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private http = inject(HttpClient);
  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(false);
  private trendingPage = signal(0);

  trendingGifsGroup = computed<Gif[][]>(() => {
    const groups: Gif[][] = [];
    for (let i = 0; i < this.trendingGifs().length; i += 3) {
      groups.push(this.trendingGifs().slice(i, i + 3));
    }
    console.log('groups', groups);
    return groups;
  });

  searchHistory = signal<Record<string, Gif[]>>(loadSearchHistoryFromLocalStorage());
  searchHistoryKeys = computed<string[]>(() => {
    return Object.keys(this.searchHistory());
  });

  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs() {
    if (this.trendingGifsLoading()) {
      return;
    }

    this.trendingGifsLoading.set(true);

    this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
          offset: this.trendingPage() * 20,
        },
      })
      .subscribe((response) => {
        const gifs = GifsMapper.mapGiphyItemsToGifArray(response.data);
        this.trendingGifs.update((prevGifs) => [...prevGifs, ...gifs]);
        this.trendingPage.update((prevPage) => prevPage + 1);
        this.trendingGifsLoading.set(false);
      });
  }

  searchGifs(query: string) {
    return this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
          q: query,
        },
      })
      .pipe(
        map(({ data }) => data),
        map((items) => GifsMapper.mapGiphyItemsToGifArray(items)),
        tap((items) => {
          this.searchHistory.update((prev) => ({ ...prev, [query.toLowerCase()]: items }));
        }),
      );
  }

  saveHistoryToStorageEffect = effect(() => {
    const searchHistory = this.searchHistory();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(searchHistory));
  });

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? [];
  }
}
