import { Component, inject, signal } from '@angular/core';
import { GifsList } from '../../components/gifs-list/gifs-list';
import { GifsService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gifs.interface';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './search-page.html',
  imports: [GifsList],
})
export default class SearchPage {
  gifsService = inject(GifsService);

  gifs = signal<Gif[]>([]);

  onSearch(query: string) {
    console.log('query', query);
    this.gifsService.searchGifs(query).subscribe((response) => {
      this.gifs.set(response);
    });
  }
}
