import type {SvelteComponent} from 'svelte';
import {Editor, Extension, type Range} from '@tiptap/core';
import {type SuggestionOptions, Suggestion} from '@tiptap/suggestion';
import {getRootNode} from '@nextlint/core';
import {PluginKey} from '@tiptap/pm/state';

import {slashRenderer} from './renderer';
import {querySuggestion} from './suggestion';

export const SlashMenuPluginKey = new PluginKey('slash-menu');

export type TextAlignment = 'left' | 'center' | 'right';

export type SlashMenuItem = {
  title: string;
  icon: SvelteComponent;
  category: {type: string; text: string; desc?: string};
  command: (props: {editor: Editor; range: Range}) => void;
};

export type SlashMenuOptions = {
  suggestion: Omit<SuggestionOptions<SlashMenuItem>, 'editor' | 'render'>;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    align: {
      setTextAlign: (align?: TextAlignment) => ReturnType;
    };
  }
}

export const SlashMenu = Extension.create<SlashMenuOptions>({
  name: 'slash-menu',
  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({editor, range, props}) => {
          props.command({editor, range});
        }
      }
    };
  },
  addCommands() {
    return {
      setTextAlign:
        (align?: TextAlignment) =>
        ({editor, tr}) => {
          const sel = editor.state.selection;
          const node = sel.$anchor.node(1);
          const from = sel.$anchor.start(1);
          const to = sel.$anchor.end(1);
          return editor
            .chain()
            .setTextSelection({from, to})
            .focus()
            .updateAttributes(node.type, {align})
            .run();
        }
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        render: slashRenderer,
        items: querySuggestion,
        decorationClass: 'slash-menu-visible',
        char: '/',
        command: ({editor, range, props}) => {
          props.command({editor, range});
        }
      })
    ];
  }
});
