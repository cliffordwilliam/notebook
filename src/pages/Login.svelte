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
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 2.5rem 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    color: #6b7280;
    text-align: center;
    font-size: 0.9375rem;
    margin-bottom: 1.75rem;
  }

  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.375rem;
  }

  input {
    width: 100%;
    padding: 0.625rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #111827;
    font-family: 'SFMono-Regular', Consolas, monospace;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  input:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
  }

  .field-error {
    color: #ef4444;
    font-size: 0.8125rem;
    margin-top: 0.375rem;
  }

  .btn-primary {
    display: block;
    width: 100%;
    padding: 0.625rem;
    margin-top: 1rem;
    background: #4f46e5;
    color: #fff;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.9375rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }

  .btn-primary:hover { background: #4338ca; }
</style>
