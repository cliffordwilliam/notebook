<script>
  import { onMount, onDestroy, tick } from 'svelte';
  import { navigate } from '../stores/router.js';
  import { dbGetNote, dbDeleteNote, handleError } from '../lib/db.js';
  import { toasts } from '../stores/toasts.js';
  import Prism from 'prismjs';
  import 'prismjs/components/prism-clike';
  import 'prismjs/components/prism-c';
  import 'prismjs/components/prism-cpp';
  import 'prismjs/components/prism-markup';
  import 'prismjs/components/prism-css';
  import 'prismjs/components/prism-javascript';
  import 'prismjs/components/prism-typescript';
  import 'prismjs/components/prism-python';
  import 'prismjs/components/prism-bash';
  import 'prismjs/components/prism-json';
  import 'prismjs/components/prism-sql';
  import 'prismjs/components/prism-yaml';

  export let id;

  let note = null;
  let loading = true;
  let contentEl;
  let tocEl;
  let hasToc = false;
  let scrollHandler;

  function buildToc() {
    if (!contentEl || !tocEl) return;
    const headings = Array.from(contentEl.querySelectorAll('h2')).filter(h => h.textContent.trim());
    if (!headings.length) return;
    headings.forEach((h, i) => {
      if (!h.id) h.id = `h-${i}`;
      const li = document.createElement('li');
      li.className = 'toc-item';
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = h.textContent;
      li.appendChild(a);
      tocEl.appendChild(li);
    });
    hasToc = true;
  }

  function updateSeen() {
    if (!contentEl || !tocEl) return;
    const headings = Array.from(contentEl.querySelectorAll('h2'));
    const items = Array.from(tocEl.querySelectorAll('.toc-item'));
    let lastSeenIndex = -1;
    headings.forEach((h, i) => {
      if (!items[i]) return;
      const seen = h.getBoundingClientRect().top < window.innerHeight;
      items[i].classList.toggle('seen', seen);
      if (seen) lastSeenIndex = i;
    });
    items.forEach((item, i) => item.classList.toggle('active', i === lastSeenIndex));
  }

  function enhanceCodeBlocks(containerEl) {
    containerEl.querySelectorAll('pre').forEach(pre => {
      const code = pre.querySelector('code');
      if (!code) return;

      // Wrap pre in .code-toolbar for copy button positioning
      const wrapper = document.createElement('div');
      wrapper.className = 'code-toolbar';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      // Copy button
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(code.textContent).then(() => {
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
        });
      });
      wrapper.appendChild(btn);

      // Line numbers — same DOM structure as prism-line-numbers plugin
      const lines = code.textContent.split('\n');
      if (lines.at(-1) === '') lines.pop();
      const rows = document.createElement('span');
      rows.className = 'line-numbers-rows';
      rows.setAttribute('aria-hidden', 'true');
      lines.forEach(() => rows.appendChild(document.createElement('span')));
      pre.classList.add('line-numbers');
      code.appendChild(rows);
    });
  }

  onMount(async () => {
    try {
      note = await dbGetNote(id);
    } catch (e) {
      handleError(e);
    } finally {
      loading = false;
    }
    if (!note) return;
    await tick();
    contentEl.querySelectorAll('pre code:not([class*="language-"])').forEach(code => {
      code.classList.add('language-cpp');
    });
    Prism.highlightAllUnder(contentEl);
    enhanceCodeBlocks(contentEl);
    buildToc();
    updateSeen();
    scrollHandler = () => updateSeen();
    window.addEventListener('scroll', scrollHandler, { passive: true });
  });

  onDestroy(() => {
    if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
  });

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  async function handleDelete() {
    if (!confirm('Delete this note? This cannot be undone.')) return;
    try {
      await dbDeleteNote(id);
      toasts.add('Note deleted.');
      navigate('list');
    } catch (e) {
      handleError(e);
    }
  }
</script>

<div class="page">
  {#if loading}
    <div class="skeleton-view">
      <div class="skeleton sk-title"></div>
      <div class="skeleton sk-meta"></div>
      <div class="skeleton sk-para"></div>
      <div class="skeleton sk-para short"></div>
      <div class="skeleton sk-para"></div>
      <div class="skeleton sk-para medium"></div>
    </div>
  {:else if note}
    <div class="top-bar">
      <button class="btn-back" on:click={() => navigate('list')}>&#8592; Back</button>
      <div class="actions">
        <button class="btn-edit" on:click={() => navigate('edit', { id })}>Edit</button>
        <button class="btn-danger" on:click={handleDelete}>Delete</button>
      </div>
    </div>

    <div class="layout">
      <article>
        <h1>{note.title || 'Untitled'}</h1>
        <div class="meta">
          <span>Created {formatDate(note.createdAt)}</span>
          {#if note.updatedAt !== note.createdAt}
            <span>&middot; Updated {formatDate(note.updatedAt)}</span>
          {/if}
        </div>
        <div class="content" bind:this={contentEl}>{@html note.content}</div>
      </article>

      <aside class="toc-sidebar" class:hidden={!hasToc}>
        <div class="toc-sticky">
          <h4 class="toc-heading">Contents</h4>
          <ul class="toc-list" bind:this={tocEl}></ul>
        </div>
      </aside>
    </div>
  {/if}
</div>

<style>
  .page {
    max-width: 1536px;
    margin: 0 auto;
    padding: 3.5rem 2rem;
  }

  .layout {
    display: grid;
    grid-template-columns: 1fr minmax(0, 65ch) 1fr;
    column-gap: 2.5rem;
  }

  article {
    grid-column: 2;
  }

  /* ── TOC — copied from theodinproject ── */
  .toc-sidebar {
    grid-column: 3;
    width: 18rem;
    justify-self: start;
  }
  .toc-sidebar.hidden { display: none; }

  .toc-sticky {
    position: sticky;
    top: 3rem;
    padding-bottom: 5rem;
  }

  .toc-heading {
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
    padding-bottom: 1rem;
    margin: 0;
  }

  .toc-list {
    display: flex;
    flex-direction: column;
    list-style: none;
    color: #6b7280;
    margin: 0;
    padding: 0;
  }

  .toc-list :global(.toc-item) {
    padding: 0.5rem 0.5rem 0.5rem 1rem;
    border-left: 2px solid #e5e7eb;
    font-size: 0.875rem;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
  }

  .toc-list :global(.toc-item a) {
    text-decoration: none;
    color: inherit;
  }

  .toc-list :global(.toc-item a:hover) { color: #1f2937; }

  .toc-list :global(.toc-item.active) {
    color: #1f2937;
    background: #f3f4f6;
    border-left-color: #a9792b;
  }

  .skeleton-view { margin-top: 1rem; }
  .sk-title  { height: 2rem;   width: 55%; margin-bottom: 0.75rem; border-radius: 0.375rem; }
  .sk-meta   { height: 0.75rem; width: 30%; margin-bottom: 2rem; }
  .sk-para   { height: 0.875rem; width: 100%; margin-bottom: 0.6rem; }
  .sk-para.short  { width: 60%; }
  .sk-para.medium { width: 80%; }

  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
  }

  .btn-back {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    font-size: 0.9375rem;
    padding: 0;
  }

  .btn-back:hover { color: #111827; }

  .actions {
    display: flex;
    gap: 0.5rem;
  }

  .btn-edit {
    padding: 0.5rem 1rem;
    background: none;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #374151;
    cursor: pointer;
    transition: background 0.15s;
  }

  .btn-edit:hover { background: #f3f4f6; }

  .btn-danger {
    padding: 0.5rem 1rem;
    background: none;
    border: 1px solid #fca5a5;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #ef4444;
    cursor: pointer;
    transition: background 0.15s;
  }

  .btn-danger:hover { background: #fee2e2; }

  article h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    line-height: 1.25;
    margin-bottom: 0.5rem;
  }

  .meta {
    font-size: 0.8125rem;
    color: #9ca3af;
    margin-bottom: 2rem;
    display: flex;
    gap: 0.4rem;
  }

  /* ── Prose — copied from theodinproject (@tailwindcss/typography defaults + odin overrides) ── */
  .content { line-height: 1.75; color: #374151; font-family: Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif; }

  .content :global(p) { margin-top: 1.25em; margin-bottom: 1.25em; }
  .content :global(p:first-child) { margin-top: 0; }
  .content :global(p:last-child) { margin-bottom: 0; }

  .content :global(h1) { font-size: 2.25em; font-weight: 800; line-height: 1.1111; margin-top: 0; margin-bottom: 0.8888em; color: #111827; }
  .content :global(h2) { font-size: 1.5em;  font-weight: 700; line-height: 1.3333; margin-top: 2em;  margin-bottom: 1em;    color: #111827; }
  .content :global(h3) { font-size: 1.25em; font-weight: 600; line-height: 1.6;    margin-top: 1.6em; margin-bottom: 0.6666667em; color: #111827; }

  .content :global(h1 + *),
  .content :global(h2 + *),
  .content :global(h3 + *),
  .content :global(h4 + *) { margin-top: 0; }

  .content :global(strong) { font-weight: 600; color: #111827; }

  .content :global(ul) { list-style-type: disc;    margin-top: 1.25em; margin-bottom: 1.25em; padding-left: 1.625em; }
  .content :global(ol) { list-style-type: decimal; margin-top: 1.25em; margin-bottom: 1.25em; padding-left: 1.625em; }
  .content :global(li) { margin-top: 0.5em; margin-bottom: 0.5em; }
  .content :global(ul > li::marker) { color: #d1d5db; }
  .content :global(ol > li::marker) { color: #6b7280; }

  .content :global(blockquote) {
    background: #f9fafb;
    border-left: 4px solid #ce973e;
    border-radius: 0.125rem;
    padding: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  .content :global(blockquote > *:first-child) { margin-top: 0; }
  .content :global(blockquote > *:last-child)  { margin-bottom: 0; }

  .content :global(hr) { border: none; border-top: 1px solid #e5e7eb; margin-top: 3em; margin-bottom: 3em; }

  /* Inline code — odin: pink-700, gray-100 bg, normal weight, rounded-md, no backtick pseudo-content */
  .content :global(code) {
    color: #be185d;
    font-size: 0.875em;
    font-weight: 400;
    background: #f3f4f6;
    padding: 0.2em 0.4em;
    border-radius: 0.375rem;
    font-family: Consolas, Monaco, 'Ubuntu Mono', monospace;
  }
  .content :global(code::before),
  .content :global(code::after) { content: none; }

  /* Code block — overrides inline code styles above */
  .content :global(pre) {
    background: #1e1e2e;
    color: #ccc;
    padding: 1.25rem;
    border-radius: 0.75rem;
    margin-bottom: 1rem;
    overflow-x: auto;
    font-family: Consolas, Monaco, 'Ubuntu Mono', monospace;
    font-size: 1rem;
    line-height: 1.7;
    tab-size: 4;
  }
  .content :global(pre code) { background: none; padding: 0; padding-top: 3px; color: inherit; font-size: inherit; font-weight: inherit; }

  /* ── Copy button ── */
  .content :global(.code-toolbar) { position: relative; margin-bottom: 1rem; }
  .content :global(.code-toolbar > pre) { margin-bottom: 0; }
  .content :global(.copy-btn) {
    position: absolute;
    top: 0.6rem;
    right: 0.6rem;
    background: #313244;
    color: #cdd6f4;
    border: 1px solid #45475a;
    border-radius: 0.3rem;
    padding: 0.2rem 0.55rem;
    font-size: 0.75rem;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .content :global(.code-toolbar:hover .copy-btn) { opacity: 1; }
  .content :global(.copy-btn:hover) { background: #45475a; }

  /* ── Line numbers ── */
  .content :global(pre.line-numbers) {
    position: relative;
    padding-left: 3.8em;
    counter-reset: linenumber;
  }
  .content :global(pre.line-numbers > code) { position: relative; }
  .content :global(.line-numbers-rows) {
    position: absolute;
    top: 0;
    left: -3.8em;
    width: 3em;
    border-right: 1px solid #45475a;
    user-select: none;
    pointer-events: none;
  }
  .content :global(.line-numbers-rows > span) {
    display: block;
    counter-increment: linenumber;
    line-height: 1.7rem;
  }
  .content :global(.line-numbers-rows > span::before) {
    content: counter(linenumber);
    color: #585b70;
    display: block;
    padding-right: 0.8em;
    text-align: right;
  }

  /* ── Token colours — copied from theodinproject/prism-theme.css ── */
  .content :global(.token.block-comment),
  .content :global(.token.cdata),
  .content :global(.token.comment),
  .content :global(.token.doctype),
  .content :global(.token.prolog)                             { color: #999; }
  .content :global(.token.punctuation)                        { color: #ccc; }
  .content :global(.token.attr-name),
  .content :global(.token.deleted),
  .content :global(.token.namespace),
  .content :global(.token.tag)                                { color: #e2777a; }
  .content :global(.token.function-name)                      { color: #6196cc; }
  .content :global(.token.boolean),
  .content :global(.token.function),
  .content :global(.token.number)                             { color: #f08d49; }
  .content :global(.token.class-name),
  .content :global(.token.constant),
  .content :global(.token.property),
  .content :global(.token.symbol)                             { color: #f8c555; }
  .content :global(.token.atrule),
  .content :global(.token.builtin),
  .content :global(.token.important),
  .content :global(.token.keyword),
  .content :global(.token.selector)                           { color: #cc99cd; }
  .content :global(.token.attr-value),
  .content :global(.token.char),
  .content :global(.token.regex),
  .content :global(.token.string),
  .content :global(.token.variable)                           { color: #7ec699; }
  .content :global(.token.entity),
  .content :global(.token.operator),
  .content :global(.token.url)                                { color: #67cdcc; }
  .content :global(.token.bold),
  .content :global(.token.important)                          { font-weight: 700; }
  .content :global(.token.italic)                             { font-style: italic; }
  .content :global(.token.entity)                             { cursor: help; }
  .content :global(.token.inserted)                           { color: green; }
</style>
