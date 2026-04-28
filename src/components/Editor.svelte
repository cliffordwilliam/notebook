<script>
  import { onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import Placeholder from '@tiptap/extension-placeholder';
  import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
  import { createLowlight } from 'lowlight';
  import cpp from 'highlight.js/lib/languages/cpp';

  const lowlight = createLowlight();
  lowlight.register('cpp', cpp);

  export let content = '';
  export let readonly = false;
  export let onChange = (_html) => {};
  export let placeholder = 'Start writing...';

  let element;
  let editor;

  onMount(() => {
    editor = new Editor({
      element,
      extensions: [
        StarterKit.configure({ italic: false, strike: false, codeBlock: false, heading: { levels: [2, 3] } }),
        Placeholder.configure({ placeholder }),
        CodeBlockLowlight.configure({ lowlight }),
      ],
      content,
      editable: !readonly,
      onTransaction: () => {
        editor = editor;
      },
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
    });
  });

  onDestroy(() => editor?.destroy());
</script>

<div class="editor-wrap" class:readonly>
  {#if !readonly && editor}
    <div class="toolbar">
      <button type="button" on:click={() => editor.chain().focus().toggleBold().run()} class:active={editor.isActive('bold')} title="Bold"><strong>B</strong></button>
      <div class="sep"></div>
      <button type="button" on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} class:active={editor.isActive('heading', { level: 2 })}>H2</button>
      <button type="button" on:click={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} class:active={editor.isActive('heading', { level: 3 })}>H3</button>
      <div class="sep"></div>
      <button type="button" on:click={() => editor.chain().focus().toggleBulletList().run()} class:active={editor.isActive('bulletList')} title="Bullet list">UL</button>
      <button type="button" on:click={() => editor.chain().focus().toggleOrderedList().run()} class:active={editor.isActive('orderedList')} title="Numbered list">OL</button>
      <div class="sep"></div>
      <button type="button" on:click={() => editor.chain().focus().toggleBlockquote().run()} class:active={editor.isActive('blockquote')} title="Blockquote">"</button>
      <button type="button" on:click={() => editor.chain().focus().toggleCodeBlock().run()} class:active={editor.isActive('codeBlock')} title="Code block">&lt;/&gt;</button>
      <div class="sep"></div>
      <button type="button" on:click={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">&#8617;</button>
      <button type="button" on:click={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">&#8618;</button>
    </div>
  {/if}
  <div class="content" bind:this={element}></div>
</div>

<style>
  .editor-wrap {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    background: #fff;
  }

  .editor-wrap.readonly {
    border: none;
    background: transparent;
  }

  .toolbar {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid #e5e7eb;
    border-radius: 0.5rem 0.5rem 0 0;
    background: #f9fafb;
  }

  .toolbar button {
    min-width: 2rem;
    padding: 0.25rem 0.375rem;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    background: none;
    cursor: pointer;
    font-size: 0.8125rem;
    color: #374151;
    line-height: 1.4;
  }

  .toolbar button:hover:not(:disabled) { background: #e5e7eb; }

  .toolbar button.active {
    background: #ede9fe;
    color: #4f46e5;
    border-color: #c4b5fd;
  }

  .toolbar button:disabled {
    opacity: 0.35;
    cursor: default;
  }

  .sep {
    width: 1px;
    height: 1.25rem;
    background: #d1d5db;
    margin: 0 0.25rem;
    flex-shrink: 0;
  }

  .content {
    padding: 1rem;
    min-height: 14rem;
    cursor: text;
  }

  .editor-wrap.readonly .content {
    padding: 0;
    min-height: 0;
    cursor: auto;
  }

  /* ── Prose ── */
  :global(.ProseMirror) { outline: none; line-height: 1.75; }
  :global(.ProseMirror p) { margin-bottom: 1rem; }
  :global(.ProseMirror p:last-child) { margin-bottom: 0; }
  :global(.ProseMirror h2) { font-size: 1.375rem; font-weight: 600; margin-top: 2rem; margin-bottom: 0.75rem; line-height: 1.3; }
  :global(.ProseMirror h3) { font-size: 1.125rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
  :global(.ProseMirror ul) { padding-left: 1.5rem; margin-bottom: 1rem; list-style-type: disc; }
  :global(.ProseMirror ol) { padding-left: 1.5rem; margin-bottom: 1rem; list-style-type: decimal; }
  :global(.ProseMirror li) { margin-bottom: 0.25rem; }
  :global(.ProseMirror blockquote) {
    border-left: 3px solid #4f46e5;
    padding-left: 1rem;
    color: #6b7280;
    margin-bottom: 1rem;
    font-style: italic;
  }
  :global(.ProseMirror code) {
    background: #f3f4f6;
    padding: 0.15em 0.4em;
    border-radius: 0.25rem;
    font-family: Consolas, Monaco, 'Ubuntu Mono', monospace;
    font-size: 0.875em;
    font-weight: 400;
  }
  :global(.ProseMirror pre) {
    background: #1e1e2e;
    color: #cdd6f4;
    padding: 1.25rem;
    border-radius: 0.75rem;
    margin-bottom: 1rem;
    overflow-x: auto;
    font-family: Consolas, Monaco, 'Ubuntu Mono', monospace;
    font-size: 0.9rem;
    line-height: 1.7;
  }
  :global(.ProseMirror pre code) { background: none; padding: 0; color: inherit; font-size: inherit; }
  :global(.ProseMirror strong) { font-weight: 700; }
  :global(.ProseMirror hr) { border: none; border-top: 1px solid #e5e7eb; margin: 1rem 0; }
  :global(.ProseMirror p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    color: #9ca3af;
    pointer-events: none;
    float: left;
    height: 0;
  }

  /* ── Syntax highlighting — Catppuccin Mocha ── */
  :global(.hljs-comment), :global(.hljs-quote) { color: #6c7086; font-style: italic; }
  :global(.hljs-keyword), :global(.hljs-selector-tag), :global(.hljs-type) { color: #cba6f7; }
  :global(.hljs-string), :global(.hljs-attr) { color: #a6e3a1; }
  :global(.hljs-number), :global(.hljs-literal) { color: #fab387; }
  :global(.hljs-title), :global(.hljs-name) { color: #89b4fa; }
  :global(.hljs-built_in) { color: #89dceb; }
  :global(.hljs-meta) { color: #f38ba8; }
  :global(.hljs-operator) { color: #89dceb; }
  :global(.hljs-punctuation) { color: #9399b2; }
  :global(.hljs-variable), :global(.hljs-params) { color: #cdd6f4; }
</style>
