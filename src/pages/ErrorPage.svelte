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
    background: #fff;
    border: 1px solid #fca5a5;
    border-radius: 0.75rem;
    padding: 2.5rem 2rem;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  }

  .icon {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: #fee2e2;
    color: #ef4444;
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
    color: #111827;
    margin-bottom: 0.75rem;
  }

  .message {
    font-size: 0.875rem;
    color: #ef4444;
    margin-bottom: 1rem;
    font-family: 'SFMono-Regular', Consolas, monospace;
    background: #fee2e2;
    padding: 0.625rem 0.75rem;
    border-radius: 0.375rem;
    word-break: break-all;
    text-align: left;
  }

  .hint {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1.75rem;
    line-height: 1.5;
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

  .btn-primary:hover { background: #4338ca; }
</style>
