<script>
  import { fly } from 'svelte/transition';
  import { toasts } from '../stores/toasts.js';
</script>

<div class="toast-container">
  {#each $toasts as toast (toast.id)}
    <div
      class="toast toast-{toast.type}"
      role="alert"
      transition:fly={{ y: -16, duration: 220 }}
    >
      <span>{toast.message}</span>
      <button on:click={() => toasts.remove(toast.id)} aria-label="Dismiss">&#x2715;</button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    top: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    z-index: 100;
  }

  .toast {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    background: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    border-left: 4px solid;
    font-size: 0.875rem;
    min-width: 220px;
    max-width: 360px;
  }

  .toast-success { border-left-color: #10b981; color: #065f46; }
  .toast-error   { border-left-color: #ef4444; color: #7f1d1d; }

  .toast button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    color: inherit;
    opacity: 0.4;
    padding: 0;
    flex-shrink: 0;
  }

  .toast button:hover { opacity: 1; }
</style>
