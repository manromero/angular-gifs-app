import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { GifsService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gifs.interface';
import { GifsList } from '../../components/gifs-list/gifs-list';

@Component({
  selector: 'gifs-history',
  templateUrl: './gifs-history.html',
  imports: [GifsList],
})
export default class GifsHistory {
  query = toSignal(inject(ActivatedRoute).params.pipe(map((params) => params['query'])));

  gifsService = inject(GifsService);

  gifsByKey: Signal<Gif[]> = computed(() => this.gifsService.getHistoryGifs(this.query()));
}
