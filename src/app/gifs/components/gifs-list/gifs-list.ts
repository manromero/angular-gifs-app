import { Component, input } from '@angular/core';
import { GifsListItem } from './gifs-list-item/gifs-list-item';

@Component({
  selector: 'gifs-list',
  templateUrl: './gifs-list.html',
  imports: [GifsListItem],
})
export class GifsList {
  gifs = input.required<string[]>();
}
