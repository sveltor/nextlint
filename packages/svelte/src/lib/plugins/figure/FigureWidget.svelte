<script lang="ts">
  import type {Editor} from '@tiptap/core';
  import {Expand, Trash2} from 'lucide-svelte';

  export let editor: Editor;
  const removeBlock = () => {
    editor.chain().deleteSelection().selectTextblockStart().run();
  };
  const updateAttribute = () => {};
</script>

<div
  class="absolute top-[-44px] left-1/2 -translate-x-1/2 rounded-md bg-background text-foreground shadow-md p-1"
>
  <button>
    <Expand size={20} />
  </button>
  <button color="red" on:mousedown={removeBlock} class="p-1 text-destructive">
    <Trash2 size={20} />
  </button>
</div>
