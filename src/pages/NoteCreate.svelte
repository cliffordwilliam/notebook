<script>
  import { navigate } from '../stores/router.js';
  import { dbCreateNote, handleError } from '../lib/db.js';
  import Editor from '../components/Editor.svelte';

  let title = '';
  let content = '';
  let saving = false;
  let titleError = '';

  async function save() {
    if (!title.trim()) {
      titleError = 'Title is required.';
      return;
    }
    saving = true;
    try {
      await dbCreateNote(title.trim(), content);
      navigate('list');
    } catch (e) {
      handleError(e);
    } finally {
      saving = false;
    }
  }
</script>

<div class="page">
  <div class="top-bar">
    <button class="btn-back" on:click={() => navigate('list')}>&#8592; Back</button>
    <h1>New Note</h1>
  </div>

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
      <Editor onChange={(html) => (content = html)} placeholder="Start writing your note..." />
    </div>

    <div class="actions">
      <button type="button" class="btn-secondary" on:click={() => navigate('list')}>Cancel</button>
      <button type="submit" class="btn-primary" disabled={saving}>
        {saving ? 'Saving...' : 'Save Note'}
      </button>
    </div>
  </form>
</div>

<style>
  .page {
    max-width: 860px;
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
    color: #111827;
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

  .field {
    margin-bottom: 1.25rem;
  }

  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.375rem;
  }

  input[type='text'] {
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1.0625rem;
    color: #111827;
    background: #fff;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  input[type='text']:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
  }

  .field-error {
    color: #ef4444;
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
    background: #4f46e5;
    color: #fff;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.9375rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }

  .btn-primary:hover:not(:disabled) { background: #4338ca; }
  .btn-primary:disabled { opacity: 0.6; cursor: default; }

  .btn-secondary {
    padding: 0.625rem 1.25rem;
    background: #fff;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.9375rem;
    color: #374151;
    cursor: pointer;
    transition: background 0.15s;
  }

  .btn-secondary:hover { background: #f3f4f6; }
</style>
