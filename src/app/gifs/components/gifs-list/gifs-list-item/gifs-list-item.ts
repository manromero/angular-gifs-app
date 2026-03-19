import { Component, input } from '@angular/core';

@Component({
  selector: 'gifs-list-item',
  templateUrl: './gifs-list-item.html',
})
export class GifsListItem {
  imageURL = input.required<string>();
}
