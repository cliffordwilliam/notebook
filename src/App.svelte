<script>
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { route, navigate } from './stores/router.js';
  import { credentials } from './stores/credentials.js';
  import Login from './pages/Login.svelte';
  import NoteList from './pages/NoteList.svelte';
  import NoteCreate from './pages/NoteCreate.svelte';
  import NoteEdit from './pages/NoteEdit.svelte';
  import NoteView from './pages/NoteView.svelte';
  import ErrorPage from './pages/ErrorPage.svelte';

  onMount(() => {
    if (get(credentials)) navigate('list');
  });
</script>

{#if $route.page === 'login'}
  <Login />
{:else if $route.page === 'list'}
  <NoteList />
{:else if $route.page === 'create'}
  <NoteCreate />
{:else if $route.page === 'edit'}
  <NoteEdit id={$route.params.id} />
{:else if $route.page === 'view'}
  <NoteView id={$route.params.id} />
{:else if $route.page === 'error'}
  <ErrorPage message={$route.params.message} />
{/if}
