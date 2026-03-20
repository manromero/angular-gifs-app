import { Component, input } from '@angular/core';
import { GifsListItem } from './gifs-list-item/gifs-list-item';
import { Gif } from '../../interfaces/gifs.interface';

@Component({
  selector: 'gifs-list',
  templateUrl: './gifs-list.html',
  imports: [GifsListItem],
})
export class GifsList {
  gifs = input.required<Gif[]>();
}
