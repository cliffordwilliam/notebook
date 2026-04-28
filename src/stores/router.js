import { writable } from 'svelte/store';

export const route = writable({ page: 'login', params: {} });

export function navigate(page, params = {}) {
  route.set({ page, params });
}
