<script>
  import { onMount } from 'svelte';
  import { navigate } from '../stores/router.js';
  import { dbGetNote, dbUpdateNote, handleError } from '../lib/db.js';
  import { toasts } from '../stores/toasts.js';
  import { ArrowLeft } from 'lucide-svelte';
  import Editor from '../components/Editor.svelte';

  export let id;

  let note = null;
  let title = '';
  let content = '';
  let saving = false;
  let loading = true;
  let titleError = '';

  onMount(async () => {
    try {
      note = await dbGetNote(id);
      title = note.title;
      content = note.content;
    } catch (e) {
      handleError(e);
    } finally {
      loading = false;
    }
  });

  async function save() {
    if (!title.trim()) {
      titleError = 'Title is required.';
      return;
    }
    saving = true;
    try {
      await dbUpdateNote(id, title.trim(), content);
      toasts.add('Note saved.');
      navigate('view', { id });
    } catch (e) {
      handleError(e);
    } finally {
      saving = false;
    }
  }
</script>

<div class="page">
  <div class="top-bar">
    <button class="btn-back" on:click={() => navigate('view', { id })}><ArrowLeft size={16} /> Back</button>
    <h1>Edit Note</h1>
  </div>

  {#if loading}
    <div class="skeleton-form">
      <div class="skeleton sk-label"></div>
      <div class="skeleton sk-input"></div>
      <div class="skeleton sk-label" style="margin-top:1.25rem"></div>
      <div class="skeleton sk-editor"></div>
    </div>
  {:else if note}
    <form on:submit|preventDefault={save}>
      <div class="field">
        <label for="title">Title</label>
        <input
          id="title"
          type="text"
          bind:value={title}
          placeholder="Note title"
          on:input={() => (titleError = '')}
          autofocus
        />
        {#if titleError}
          <p class="field-error">{titleError}</p>
        {/if}
      </div>

      <div class="field">
        <label>Content</label>
        <Editor
          content={note.content}
          onChange={(html) => (content = html)}
          placeholder="Start writing your note..."
        />
      </div>

      <div class="actions">
        <button type="button" class="btn-secondary" on:click={() => navigate('view', { id })}>Cancel</button>
        <button type="submit" class="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  {/if}
</div>

<style>
  .page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .top-bar {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.75rem;
  }

  h1 {
    font-size: 1.375rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .btn-back {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    background: none;
    border: none;
    color: var(--color-text-dim);
    cursor: pointer;
    font-size: 0.9375rem;
    padding: 0;
  }

  .btn-back:hover { color: var(--color-text); }

  .sk-label  { height: 0.75rem; width: 3rem; margin-bottom: 0.375rem; }
  .sk-input  { height: 2.625rem; width: 100%; margin-bottom: 0; border-radius: 0.375rem; }
  .sk-editor { height: 16rem; width: 100%; border-radius: 0.5rem; }

  .field {
    margin-bottom: 1.25rem;
  }

  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-muted);
    margin-bottom: 0.375rem;
  }

  input[type='text'] {
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    font-size: 1.0625rem;
    color: var(--color-text);
    background: var(--color-bg);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  input[type='text']:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-accent-shadow);
  }

  .field-error {
    color: var(--color-danger);
    font-size: 0.8125rem;
    margin-top: 0.375rem;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .btn-primary {
    padding: 0.625rem 1.5rem;
    background: var(--color-accent);
    color: var(--color-accent-text);
    border: none;
    border-radius: 0.375rem;
    font-size: 0.9375rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }

  .btn-primary:hover:not(:disabled) { background: var(--color-accent-hover); }
  .btn-primary:disabled { opacity: 0.6; cursor: default; }

  .btn-secondary {
    padding: 0.625rem 1.25rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    font-size: 0.9375rem;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: background 0.15s;
  }

  .btn-secondary:hover { background: var(--color-surface-hover); }
</style>
