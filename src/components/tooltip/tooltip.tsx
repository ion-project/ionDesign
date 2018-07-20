import { Component, Element, Prop, EventListenerEnable, Listen } from '@stencil/core';

@Component({
  tag: 'id-tooltip',
  styleUrl: 'tooltip.scss'
})
export class Tooltip {

  showingTooltip: boolean = false;
  tooltipEndTimeout: any;

  @Element() el: HTMLElement;

  @Prop({context: 'enableListener'}) enableListener: EventListenerEnable;
  @Prop() text: string;

  componentWillLoad() {
    let isTouch = ('ontouchstart' in window);

    this.enableListener(this, 'mouseover', !isTouch, 'parent');
    this.enableListener(this, 'mouseout', true, 'parent');
    this.enableListener(this, 'focus', true, 'parent');
    this.enableListener(this, 'blur', true, 'parent');
    this.enableListener(this, 'contextmenu', isTouch, 'parent');
  }

  @Listen('mouseover')
  @Listen('focus')
  @Listen('contextmenu')
  tooltipStart() {
    if(!this.showingTooltip){
      this.addTooltip();
    }
  }

  @Listen('mouseout')
  @Listen('blur')
  tooltipEnd() {
    clearTimeout(this.tooltipEndTimeout);

    let tooltipList = document.getElementsByClassName('tooltip');

    for(let i = 0; i < tooltipList.length; i = i + 1){
      tooltipList[i].classList.add('inactive');

      this.removeTooltip(tooltipList[i]);
    }
  }

  addTooltip() {
    const RECT = this.el.parentElement.getBoundingClientRect();

    let tooltip = document.createElement('span');

    tooltip.textContent = this.text;
    tooltip.style.top = RECT.top + RECT.height + 'px';
    tooltip.style.left = RECT.left + RECT.width + 'px';
    tooltip.classList.add('tooltip');

    document.body.appendChild(tooltip);

    this.showingTooltip = true;

    this.tooltipEndTimeout = setTimeout(() => {
      tooltip.classList.add('inactive');

      this.removeTooltip(tooltip);
    }, 1500);
  }

  removeTooltip(tooltip: Element) {
    setTimeout(() => {
      tooltip.remove();

      this.showingTooltip = false;
    }, 75);
  }

  render() {
    return null;
  }
}
