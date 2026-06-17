<script>
  import { navigate } from '../stores/router.js';

  export let message = 'An unexpected database error occurred.';
</script>

<div class="page">
  <div class="card">
    <div class="icon">!</div>
    <h1>Database Error</h1>
    <p class="message">{message}</p>
    <p class="hint">
      This usually means the database schema does not match what this app expects.
      Verify your NeonDB has the correct table structure before reconnecting.
    </p>
    <button class="btn-primary" on:click={() => navigate('login')}>Re-enter credentials</button>
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
    max-width: 440px;
    background: var(--color-surface);
    border: 1px solid var(--color-danger-border);
    border-radius: 0.75rem;
    padding: 2.5rem 2rem;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .icon {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: var(--color-danger-soft);
    color: var(--color-danger);
    font-size: 1.5rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
  }

  h1 {
    font-size: 1.375rem;
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 0.75rem;
  }

  .message {
    font-size: 0.875rem;
    color: var(--color-danger);
    margin-bottom: 1rem;
    font-family: 'SFMono-Regular', Consolas, monospace;
    background: var(--color-danger-soft);
    padding: 0.625rem 0.75rem;
    border-radius: 0.375rem;
    word-break: break-all;
    text-align: left;
  }

  .hint {
    font-size: 0.875rem;
    color: var(--color-text-dim);
    margin-bottom: 1.75rem;
    line-height: 1.5;
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

  .btn-primary:hover { background: var(--color-accent-hover); }
</style>
