<script lang="ts">
  import {
    HighlightExtension,
    type Preset,
    type HighlightProps
  } from './tiptap-highlight';
  import {Check} from 'lucide-svelte';
  import {createEventDispatcher} from 'svelte';
  import {useFloatingProps} from '$lib/node-view';

  const dispatcher = createEventDispatcher<{toggle: void}>();

  const {mark, pos, node, editor} = useFloatingProps();

  $: selectPreset = mark?.attrs.preset || {};

  const toggleColor = (preset: Preset) => {
    dispatcher('toggle');
    if (preset.backgroundColor === selectPreset?.backgroundColor) {
      if (
        editor
          .chain()
          .setTextSelection({
            from: pos,
            to: pos + node.textContent.length
          })
          .unsetHighlight()
          .run()
      ) {
        selectPreset = {} as any;
      }
      return;
    }

    if (!editor.state.selection.empty) {
      editor?.commands.setHighlight({preset});
    } else {
      editor
        .chain()
        .setTextSelection({
          from: pos,
          to: pos + node.textContent.length
        })
        .setHighlight({preset})
        .setTextSelection(pos)
        .run();
    }
    selectPreset = preset;
  };

  $: presets = HighlightExtension.options.presets.map(p => ({
    ...p,
    isSelect: p.backgroundColor === selectPreset?.backgroundColor
  }));
</script>

<div class="p-4" data-testid="highlight">
  <div class="flex flex-row bg-background p-2 rounded-md gap-2 shadow-sm">
    {#each presets as preset (preset.backgroundColor)}
      <a
        on:mousedown|stopPropagation={e => {
          toggleColor(preset);
        }}
        class="cursor-pointer w-6 h-6 rounded-full"
        style="background-color:{preset.backgroundColor}"
      >
        {#if preset.isSelect}
          <div class="flex justify-center items-center h-full">
            <Check size={20} color={preset.textColor} />
          </div>
        {/if}
      </a>
    {/each}
  </div>
</div>
