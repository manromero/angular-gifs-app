import { AfterViewInit, Component, ElementRef, inject, signal, viewChild } from '@angular/core';

import { GifsService } from '../../services/gifs.service';
import { ScrollStateService } from '@/app/shared/services/scroll-state.service';

const SCROLL_IS_AT_BOTTOM_MARGIN = 300;

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './trending-page.html',
})
export default class TrendingPage implements AfterViewInit {
  gifsService = inject(GifsService);
  scrollStateService = inject(ScrollStateService);

  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv');

  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (!scrollDiv) {
      return;
    }

    scrollDiv.scrollTop = this.scrollStateService.trendingScrollState();
  }

  onScroll(event: Event) {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (!scrollDiv) {
      return;
    }

    const { scrollTop, clientHeight, scrollHeight } = scrollDiv;

    this.scrollStateService.trendingScrollState.set(scrollTop);

    const isAtBottom = scrollTop + clientHeight + SCROLL_IS_AT_BOTTOM_MARGIN >= scrollHeight;

    if (isAtBottom) {
      this.gifsService.loadTrendingGifs();
    }
  }
}
