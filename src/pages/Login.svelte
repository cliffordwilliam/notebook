<script>
  import { credentials } from '../stores/credentials.js';
  import { navigate } from '../stores/router.js';

  let connectionString = '';
  let error = '';

  function connect() {
    const trimmed = connectionString.trim();
    if (!trimmed) {
      error = 'Please enter a connection string.';
      return;
    }
    if (!trimmed.startsWith('postgres://') && !trimmed.startsWith('postgresql://')) {
      error = 'Must start with postgres:// or postgresql://';
      return;
    }
    credentials.save(trimmed);
    navigate('list');
  }
</script>

<div class="page">
  <div class="card">
    <h1>Notebook</h1>
    <p class="subtitle">Connect to your NeonDB to get started.</p>

    <form on:submit|preventDefault={connect}>
      <label for="conn">Connection string</label>
      <input
        id="conn"
        type="password"
        bind:value={connectionString}
        placeholder="postgres://user:password@host/db"
        autocomplete="off"
        spellcheck="false"
      />
      {#if error}
        <p class="field-error">{error}</p>
      {/if}
      <button type="submit" class="btn-primary">Connect</button>
    </form>
  </div>
</div>

<style>
  .page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .card {
    width: 100%;
    max-width: 420px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 0.75rem;
    padding: 2.5rem 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-text);
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    color: var(--color-text-dim);
    text-align: center;
    font-size: 0.9375rem;
    margin-bottom: 1.75rem;
  }

  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-muted);
    margin-bottom: 0.375rem;
  }

  input {
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: var(--color-text);
    background: var(--color-bg);
    font-family: 'SFMono-Regular', Consolas, monospace;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  input:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-accent-shadow);
  }

  .field-error {
    color: var(--color-danger);
    font-size: 0.8125rem;
    margin-top: 0.375rem;
  }

  .btn-primary {
    display: block;
    width: 100%;
    padding: 0.625rem;
    margin-top: 1rem;
    background: var(--color-accent);
    color: var(--color-accent-text);
    border: none;
    border-radius: 0.375rem;
    font-size: 0.9375rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }

  .btn-primary:hover { background: var(--color-accent-hover); }
</style>
