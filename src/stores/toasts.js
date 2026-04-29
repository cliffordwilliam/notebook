import { writable } from 'svelte/store';

function createToasts() {
  const { subscribe, update } = writable([]);

  function add(message, type = 'success') {
    const id = Date.now();
    update(ts => [...ts, { id, message, type }]);
    setTimeout(() => remove(id), 3500);
  }

  function remove(id) {
    update(ts => ts.filter(t => t.id !== id));
  }

  return { subscribe, add, remove };
}

export const toasts = createToasts();
