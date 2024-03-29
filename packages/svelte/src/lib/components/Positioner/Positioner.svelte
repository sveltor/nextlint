<script lang="ts" context="module">
  let provider: PositionProvider;
</script>

<script lang="ts">
  import {useEditor} from '$lib/context';
  import {
    computePosition,
    flip,
    offset,
    shift,
    type VirtualElement
  } from '@floating-ui/dom';
  import {onDestroy, setContext} from 'svelte';

  import {cn} from '$lib/helpers';

  import {PositionProvider, positionStore, type Position} from './provider';

  setContext('positioner', positionStore);

  const editor = useEditor();
  export let position: Position = 'cursor';

  let computing = false;
  let domPosition: {x: number; y: number} | null;

  provider ||= PositionProvider.create($editor!);

  let disposable = () => {};
  const floating = (element: HTMLDivElement) => {
    Object.assign(element.style, {
      opacity: 0,
      transition: 'opacity 0.2s ease-in-out'
    });
    disposable = provider.register(position, {
      async onVisible(data) {
        if (computing) return;
        computing = true;
        const virtualElement: VirtualElement = {
          getBoundingClientRect() {
            return data.clientRects;
          }
        };
        domPosition = await computePosition(virtualElement, element, {
          placement: 'top',
          middleware: [offset(10), flip(), shift()]
        });
        Object.assign(element.style, {
          left: `${domPosition.x}px`,
          top: `${domPosition.y}px`
        });
        requestAnimationFrame(() => {
          element.style.opacity = '1';
        });
        computing = false;
      },
      onHide() {
        domPosition = null;
      }
    });
  };

  onDestroy(() => {
    disposable();
    provider.destroy();
  });
</script>

<div
  use:floating
  class={cn(
    'absolute transition-opacity',
    domPosition ? 'visible' : 'invisible pointer-events-none'
  )}
>
  <slot visible={Boolean(domPosition)} />
</div>
