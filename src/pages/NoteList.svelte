<script>
  import { onMount } from 'svelte';
  import { credentials } from '../stores/credentials.js';
  import { navigate } from '../stores/router.js';
  import { dbGetNotes, dbCountNotes, dbDeleteNote, handleError } from '../lib/db.js';
  import { toasts } from '../stores/toasts.js';

  const PER_PAGE = 10;
  let search = '';
  let page = 1;
  let notes = [];
  let total = 0;
  let loading = true;
  let debounceTimer;

  $: totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  async function fetchNotes() {
    loading = true;
    try {
      [notes, total] = await Promise.all([
        dbGetNotes(search.trim(), page, PER_PAGE),
        dbCountNotes(search.trim()),
      ]);
    } catch (e) {
      handleError(e);
    } finally {
      loading = false;
    }
  }

  onMount(fetchNotes);

  function onSearchInput() {
    page = 1;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fetchNotes, 300);
  }

  function stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  async function handleDelete(id) {
    if (!confirm('Delete this note? This cannot be undone.')) return;
    try {
      await dbDeleteNote(id);
      toasts.add('Note deleted.');
      await fetchNotes();
    } catch (e) {
      handleError(e);
    }
  }

  function disconnect() {
    credentials.clear();
    navigate('login');
  }
</script>

<div class="page">
  <header>
    <h1>Notebook</h1>
    <div class="header-right">
      {#if $credentials}
        <button class="btn-ghost" on:click={disconnect}>Disconnect</button>
      {/if}
      <button class="btn-primary" on:click={() => navigate('create')}>+ New Note</button>
    </div>
  </header>

  <div class="search-row">
    <input
      type="search"
      placeholder="Search by title..."
      bind:value={search}
      on:input={onSearchInput}
    />
  </div>

  {#if loading}
    <ul class="note-list">
      {#each Array(5) as _}
        <li class="note-card">
          <div class="sk-body">
            <div class="skeleton sk-note-title"></div>
            <div class="skeleton sk-note-preview"></div>
            <div class="skeleton sk-note-date"></div>
          </div>
          <div class="note-actions">
            <div class="skeleton sk-btn"></div>
            <div class="skeleton sk-btn"></div>
          </div>
        </li>
      {/each}
    </ul>
  {:else if notes.length === 0}
    <div class="empty">
      {#if search.trim()}
        No notes match &ldquo;{search}&rdquo;
      {:else}
        No notes yet. Create your first one!
      {/if}
    </div>
  {:else}
    <ul class="note-list">
      {#each notes as note (note.id)}
        <li class="note-card">
          <button class="note-body" on:click={() => navigate('view', { id: note.id })}>
            <span class="note-title">{note.title || 'Untitled'}</span>
            <span class="note-preview">{stripHtml(note.content).slice(0, 120) || 'No content.'}</span>
            <span class="note-date">{formatDate(note.updatedAt)}</span>
          </button>
          <div class="note-actions">
            <button class="btn-action" on:click={() => navigate('edit', { id: note.id })}>Edit</button>
            <button class="btn-action danger" on:click={() => handleDelete(note.id)}>Del</button>
          </div>
        </li>
      {/each}
    </ul>

    {#if totalPages > 1}
      <div class="pagination">
        <button disabled={page === 1} on:click={() => { page--; fetchNotes(); }}>&#8592; Prev</button>
        <span>{page} / {totalPages}</span>
        <button disabled={page === totalPages} on:click={() => { page++; fetchNotes(); }}>Next &#8594;</button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .page {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .header-right {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .search-row {
    margin-bottom: 1.25rem;
  }

  .search-row input {
    width: 100%;
    padding: 0.625rem 0.875rem;
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    font-size: 0.9375rem;
    color: var(--color-text);
    background: var(--color-bg);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .search-row input:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-accent-shadow);
  }

  .sk-body         { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.35rem; padding: 0.875rem 1rem; }
  .sk-note-title   { height: 0.875rem; width: 55%; }
  .sk-note-preview { height: 0.75rem;  width: 82%; }
  .sk-note-date    { height: 0.65rem;  width: 25%; }
  .sk-btn          { height: 1.6rem; width: 2.25rem; border-radius: 0.25rem; }

  .empty {
    text-align: center;
    color: var(--color-text-dim);
    padding: 4rem 1rem;
    font-size: 1rem;
  }

  .note-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .note-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    overflow: hidden;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .note-card:hover {
    border-color: var(--color-accent);
    box-shadow: 0 1px 4px var(--color-accent-shadow);
  }

  .note-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2rem;
    padding: 0.875rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
  }

  .note-title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  .note-preview {
    font-size: 0.875rem;
    color: var(--color-text-dim);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  .note-date {
    font-size: 0.75rem;
    color: var(--color-text-faint);
  }

  .note-actions {
    display: flex;
    gap: 0.25rem;
    padding: 0 0.75rem;
    flex-shrink: 0;
  }

  .btn-primary {
    padding: 0.5rem 1rem;
    background: var(--color-accent);
    color: var(--color-accent-text);
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
    white-space: nowrap;
  }

  .btn-primary:hover { background: var(--color-accent-hover); }

  .btn-ghost {
    padding: 0.5rem 0.75rem;
    background: none;
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: var(--color-text-dim);
    cursor: pointer;
    transition: background 0.15s;
  }

  .btn-ghost:hover { background: var(--color-surface-hover); }

  .btn-action {
    padding: 0.3rem 0.6rem;
    background: none;
    border: 1px solid var(--color-border);
    border-radius: 0.25rem;
    font-size: 0.75rem;
    color: var(--color-text-dim);
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }

  .btn-action:hover { background: var(--color-surface-hover); color: var(--color-text-muted); }
  .btn-action.danger:hover { background: var(--color-danger-soft); color: var(--color-danger); border-color: var(--color-danger-border); }

  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }

  .pagination button {
    padding: 0.375rem 0.875rem;
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    background: var(--color-surface);
    font-size: 0.875rem;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: background 0.15s;
  }

  .pagination button:disabled { opacity: 0.4; cursor: default; }
  .pagination button:not(:disabled):hover { background: var(--color-surface-hover); }
</style>
