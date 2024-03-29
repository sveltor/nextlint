<script lang="ts">
  import {cn} from '$lib/helpers';
  import {useContentRef, useNodeViewProps} from '$lib/node-view';
  import {
    AlignVerticalSpaceAround,
    GalleryVertical,
    Trash2
  } from 'lucide-svelte';

  const contentRef = useContentRef();
  const props = useNodeViewProps();

  let {node, editor, getPos, updateAttributes} = $props;
  $: ({node, selected} = $props);
  $: attrs = node.attrs;

  const onSelect = () => {
    editor.commands.setNodeSelection(getPos());
  };
</script>

<figure
  data-node-type="figure"
  data-align={attrs.direction}
  style="position:relative;"
  class="relative"
>
  {#if selected}
    <div class="absolute inset-x-0 flex justify-center top-[-24px]">
      <div
        class="flex flex-row items-center bg-background shadow-md rounded-md z-[1px] py-1 px-2 gap-2"
      >
        <button
          aria-label="Fit Image"
          on:mousedown={() => updateAttributes({fit: 'contain'})}
          class={cn(
            attrs.fit === 'contain' ? 'bg-accent' : 'bg-background',
            'p-[6px] rounded-md hover:bg-secondary'
          )}
        >
          <AlignVerticalSpaceAround size={16} />
        </button>
        <button
          aria-label="Fit View"
          on:mousedown={() => updateAttributes({fit: 'cover'})}
          class={cn(
            attrs.fit === 'cover' ? 'bg-accent' : 'bg-background',
            'p-[6px] rounded-md hover:bg-secondary'
          )}
        >
          <GalleryVertical size={16} />
        </button>
        <div class="w-[1px] h-6 bg-border" />
        <button
          color="red"
          class="p-1 text-destructive"
          on:mousedown={$props.deleteNode}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  {/if}
  <img
    alt={attrs.alt}
    src={attrs.src}
    on:mousedown|preventDefault|stopPropagation={onSelect}
    style="object-fit: {attrs.fit};cursor:pointer;"
    class={cn(
      'border-none rounded-md',
      selected && 'outline outline-offset-1 outline-primary'
    )}
  />
  <figcaption use:contentRef>
    {node.textContent || 'description...'}
  </figcaption>
</figure>

<style lang="scss">
  .figure {
    border: 2px solid transparent;
    border-radius: 4px;
  }
</style>
