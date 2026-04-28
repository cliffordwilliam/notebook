<script>
  import { onMount } from 'svelte';
  import { credentials } from '../stores/credentials.js';
  import { navigate } from '../stores/router.js';
  import { dbGetNotes, dbDeleteNote, handleError } from '../lib/db.js';

  const PER_PAGE = 10;
  let search = '';
  let page = 1;
  let notes = [];
  let loading = true;

  onMount(async () => {
    try {
      notes = await dbGetNotes();
    } catch (e) {
      handleError(e);
    } finally {
      loading = false;
    }
  });

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

  $: filtered = notes.filter(n => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      stripHtml(n.content).toLowerCase().includes(q)
    );
  });

  $: totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  $: paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  async function handleDelete(id) {
    if (!confirm('Delete this note? This cannot be undone.')) return;
    try {
      await dbDeleteNote(id);
      notes = notes.filter(n => n.id !== id);
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
      placeholder="Search by title or content..."
      bind:value={search}
      on:input={() => (page = 1)}
    />
  </div>

  {#if paginated.length === 0}
    <div class="empty">
      {#if search.trim()}
        No notes match &ldquo;{search}&rdquo;
      {:else}
        No notes yet. Create your first one!
      {/if}
    </div>
  {:else}
    <ul class="note-list">
      {#each paginated as note (note.id)}
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
        <button disabled={page === 1} on:click={() => page--}>&#8592; Prev</button>
        <span>{page} / {totalPages}</span>
        <button disabled={page === totalPages} on:click={() => page++}>Next &#8594;</button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .page {
    max-width: 860px;
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
    color: #111827;
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
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 0.9375rem;
    color: #111827;
    background: #fff;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .search-row input:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
  }

  .empty {
    text-align: center;
    color: #6b7280;
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
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    overflow: hidden;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .note-card:hover {
    border-color: #c4b5fd;
    box-shadow: 0 1px 4px rgba(79, 70, 229, 0.08);
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
    color: #111827;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  .note-preview {
    font-size: 0.875rem;
    color: #6b7280;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  .note-date {
    font-size: 0.75rem;
    color: #9ca3af;
  }

  .note-actions {
    display: flex;
    gap: 0.25rem;
    padding: 0 0.75rem;
    flex-shrink: 0;
  }

  .btn-primary {
    padding: 0.5rem 1rem;
    background: #4f46e5;
    color: #fff;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
    white-space: nowrap;
  }

  .btn-primary:hover { background: #4338ca; }

  .btn-ghost {
    padding: 0.5rem 0.75rem;
    background: none;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #6b7280;
    cursor: pointer;
    transition: background 0.15s;
  }

  .btn-ghost:hover { background: #f3f4f6; }

  .btn-action {
    padding: 0.3rem 0.6rem;
    background: none;
    border: 1px solid #e5e7eb;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    color: #6b7280;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }

  .btn-action:hover { background: #f3f4f6; color: #374151; }
  .btn-action.danger:hover { background: #fee2e2; color: #ef4444; border-color: #fca5a5; }

  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
    font-size: 0.875rem;
    color: #374151;
  }

  .pagination button {
    padding: 0.375rem 0.875rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background: #fff;
    font-size: 0.875rem;
    color: #374151;
    cursor: pointer;
    transition: background 0.15s;
  }

  .pagination button:disabled { opacity: 0.4; cursor: default; }
  .pagination button:not(:disabled):hover { background: #f3f4f6; }
</style>
