import { writable } from 'svelte/store';

const KEY = 'nb_connection';

function createStore() {
  const { subscribe, set } = writable(localStorage.getItem(KEY) || null);
  return {
    subscribe,
    save(connectionString) {
      localStorage.setItem(KEY, connectionString);
      set(connectionString);
    },
    clear() {
      localStorage.removeItem(KEY);
      set(null);
    },
  };
}

export const credentials = createStore();
