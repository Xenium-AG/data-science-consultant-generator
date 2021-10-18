<script lang="ts">
  import Swiper from './components/Swiper.svelte'
  import Welcome from './components/Welcome.svelte'
  import Results from './components/Results.svelte'

  import { screen } from './stores/store'
  import { ScreenTypes } from './logic/screens'

  let config
  ;(async () => {
    config = await (await fetch('./data/config.json')).json()
  })()
</script>

<main class="max-w-sm w-full m-auto grid grid-cols-1 gap-3">
  {#if $screen === ScreenTypes.Welcome}
    <Welcome {config} />
  {:else if $screen === ScreenTypes.Swiper}
    <Swiper {config} />
  {:else}
    <Results {config} />
  {/if}
</main>

<style>
  :root {
    font-family: 'Trebuchet MS', -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
      sans-serif;
    @apply bg-cool-gray-200;
    @apply text-gray-700;
    height: 100%;
    margin: 0;
  }
  :global(body) {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    margin: 0;
  }
  :global(#app) {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-x: hidden;
    
  }
</style>
