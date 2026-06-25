<script>
  import { onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import Placeholder from '@tiptap/extension-placeholder';
  import Link from '@tiptap/extension-link';
  import {
    Bold as BoldIcon,
    Link as LinkIcon,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Code as CodeIcon,
    Minus,
    Undo2,
    Redo2,
  } from 'lucide-svelte';

  const LANGUAGES = [
    { value: 'cpp',        label: 'C++' },
    { value: 'c',          label: 'C' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python',     label: 'Python' },
    { value: 'bash',       label: 'Bash' },
    { value: 'css',        label: 'CSS' },
    { value: 'markup',     label: 'HTML' },
    { value: 'json',       label: 'JSON' },
    { value: 'sql',        label: 'SQL' },
    { value: 'yaml',       label: 'YAML' },
    { value: 'kotlin',     label: 'Kotlin / KTS' },
    { value: 'xml',        label: 'XML' },
    { value: 'cmake',      label: 'CMake' },
    { value: 'mermaid',    label: 'Mermaid Diagram' },
  ];

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
        StarterKit.configure({ italic: false, strike: false, heading: { levels: [2, 3] } }),
        Placeholder.configure({ placeholder }),
        Link.configure({ openOnClick: false, rel: 'noopener noreferrer' }),
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

  function handleLink() {
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
    } else {
      const url = window.prompt('URL');
      if (url) editor.chain().focus().setLink({ href: url }).run();
    }
  }

  onDestroy(() => editor?.destroy());
</script>

<div class="editor-wrap" class:readonly>
  {#if !readonly && editor}
    <div class="toolbar">
      <button type="button" on:click={() => editor.chain().focus().toggleBold().run()} class:active={editor.isActive('bold')} title="Bold"><BoldIcon size={16} /></button>
      <button type="button" on:click={handleLink} class:active={editor.isActive('link')} title="Link"><LinkIcon size={16} /></button>
      <div class="sep"></div>
      <button type="button" on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} class:active={editor.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 size={16} /></button>
      <button type="button" on:click={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} class:active={editor.isActive('heading', { level: 3 })} title="Heading 3"><Heading3 size={16} /></button>
      <div class="sep"></div>
      <button type="button" on:click={() => editor.chain().focus().toggleBulletList().run()} class:active={editor.isActive('bulletList')} title="Bullet list"><List size={16} /></button>
      <button type="button" on:click={() => editor.chain().focus().toggleOrderedList().run()} class:active={editor.isActive('orderedList')} title="Numbered list"><ListOrdered size={16} /></button>
      <div class="sep"></div>
      <button type="button" on:click={() => editor.chain().focus().toggleBlockquote().run()} class:active={editor.isActive('blockquote')} title="Blockquote"><Quote size={16} /></button>
      <button type="button" on:click={() => editor.chain().focus().toggleCodeBlock().run()} class:active={editor.isActive('codeBlock')} title="Code block"><CodeIcon size={16} /></button>
      <button type="button" on:click={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule"><Minus size={16} /></button>
      {#if editor.isActive('codeBlock')}
        <select
          title="Language"
          value={editor.getAttributes('codeBlock').language ?? 'cpp'}
          on:change={e => editor.chain().focus().updateAttributes('codeBlock', { language: e.target.value }).run()}
        >
          {#each LANGUAGES as lang}
            <option value={lang.value}>{lang.label}</option>
          {/each}
        </select>
      {/if}
      <div class="sep"></div>
      <button type="button" on:click={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Undo2 size={16} /></button>
      <button type="button" on:click={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Redo2 size={16} /></button>
    </div>
  {/if}
  <div class="content" bind:this={element}></div>
</div>

<style>
  .editor-wrap {
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    background: var(--color-surface);
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
    border-bottom: 1px solid var(--color-border);
    border-radius: 0.5rem 0.5rem 0 0;
    background: var(--color-bg);
  }

  .toolbar button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    height: 2rem;
    padding: 0.375rem;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    background: none;
    cursor: pointer;
    color: var(--color-text-muted);
  }

  .toolbar button:hover:not(:disabled) { background: var(--color-surface-hover); }

  .toolbar button.active {
    background: var(--color-accent-soft);
    color: var(--color-accent);
    border-color: var(--color-accent);
  }

  .toolbar button:disabled {
    opacity: 0.35;
    cursor: default;
  }

  .toolbar select {
    padding: 0.2rem 0.375rem;
    border: 1px solid var(--color-border);
    border-radius: 0.25rem;
    background: var(--color-surface);
    font-size: 0.8125rem;
    color: var(--color-text-muted);
    cursor: pointer;
  }

  .toolbar select:focus { outline: none; border-color: var(--color-accent); }

  .sep {
    width: 1px;
    height: 1.25rem;
    background: var(--color-border);
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
    background: rgba(55, 65, 81, 0.3);
    border-left: 4px solid var(--color-accent);
    border-radius: 0.375rem;
    padding: 1rem;
    margin-bottom: 1rem;
  }
  :global(.ProseMirror code) {
    background: rgba(55, 65, 81, 0.4);
    color: #f472b6;
    padding: 0.25rem;
    border-radius: 0.375rem;
    font-family: 'JetBrains Mono', Consolas, Monaco, 'Ubuntu Mono', monospace;
    font-size: 0.8125em;
    font-weight: 400;
  }
  :global(.ProseMirror code::before),
  :global(.ProseMirror code::after) { content: none; }
  :global(.ProseMirror pre) {
    background: rgba(30, 41, 59, 0.7);
    box-shadow: 0 0 0 1px rgba(203, 213, 225, 0.1);
    color: var(--color-text);
    padding: 1.25rem;
    border-radius: 0.75rem;
    margin-bottom: 1rem;
    overflow-x: auto;
    font-family: 'JetBrains Mono', Consolas, Monaco, 'Ubuntu Mono', monospace;
    font-size: 0.9rem;
    line-height: 1.7;
    tab-size: 4;
  }
  :global(.ProseMirror pre code) { background: none; padding: 0; color: inherit; font-size: inherit; }
  :global(.ProseMirror a) { color: #93c5fd; text-decoration: underline; cursor: pointer; }
  :global(.ProseMirror a:hover) { text-decoration: none; }
  :global(.ProseMirror strong) { font-weight: 700; }
  :global(.ProseMirror hr) { border: none; border-top: 1px solid var(--color-border); margin: 1rem 0; }
  :global(.ProseMirror p.is-editor-empty:first-child::before) {
    content: attr(data-placeholder);
    color: var(--color-text-faint);
    pointer-events: none;
    float: left;
    height: 0;
  }
</style>
