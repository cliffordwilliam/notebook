<script>
  import { onMount, tick } from 'svelte';
  import { navigate } from '../stores/router.js';
  import { dbGetNote, dbDeleteNote, handleError } from '../lib/db.js';
  import hljs from 'highlight.js/lib/core';
  import cpp from 'highlight.js/lib/languages/cpp';

  hljs.registerLanguage('cpp', cpp);

  export let id;

  let note = null;
  let loading = true;

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
    document.querySelectorAll('.content pre code').forEach(el => hljs.highlightElement(el));
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
      navigate('list');
    } catch (e) {
      handleError(e);
    }
  }
</script>

<div class="page">
  {#if loading}
    <p class="loading">Loading...</p>
  {:else if note}
    <div class="top-bar">
      <button class="btn-back" on:click={() => navigate('list')}>&#8592; Back</button>
      <div class="actions">
        <button class="btn-edit" on:click={() => navigate('edit', { id })}>Edit</button>
        <button class="btn-danger" on:click={handleDelete}>Delete</button>
      </div>
    </div>

    <article>
      <h1>{note.title || 'Untitled'}</h1>
      <div class="meta">
        <span>Created {formatDate(note.createdAt)}</span>
        {#if note.updatedAt !== note.createdAt}
          <span>&middot; Updated {formatDate(note.updatedAt)}</span>
        {/if}
      </div>
      <div class="content">{@html note.content}</div>
    </article>
  {/if}
</div>

<style>
  .page {
    max-width: 860px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .loading {
    color: #6b7280;
    padding: 2rem 0;
  }

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

  .content { line-height: 1.75; }
  .content :global(p) { margin-bottom: 1rem; }
  .content :global(p:last-child) { margin-bottom: 0; }
  .content :global(h1) { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.75rem; line-height: 1.2; }
  .content :global(h2) { font-size: 1.375rem; font-weight: 600; margin-top: 2rem; margin-bottom: 0.75rem; line-height: 1.3; }
  .content :global(h3) { font-size: 1.125rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
  .content :global(ul) { padding-left: 1.5rem; margin-bottom: 1rem; list-style-type: disc; }
  .content :global(ol) { padding-left: 1.5rem; margin-bottom: 1rem; list-style-type: decimal; }
  .content :global(li) { margin-bottom: 0.25rem; }
  .content :global(blockquote) {
    border-left: 3px solid #4f46e5;
    padding-left: 1rem;
    color: #6b7280;
    font-style: italic;
    margin-bottom: 1rem;
  }
  .content :global(code) {
    background: #f3f4f6;
    padding: 0.15em 0.4em;
    border-radius: 0.25rem;
    font-family: Consolas, Monaco, 'Ubuntu Mono', monospace;
    font-size: 0.875em;
    font-weight: 400;
  }
  .content :global(pre) {
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
  .content :global(pre code) { background: none; padding: 0; color: inherit; font-size: inherit; }
  .content :global(strong) { font-weight: 700; }
  .content :global(hr) { border: none; border-top: 1px solid #e5e7eb; margin: 1.5rem 0; }
</style>
