<script lang="ts">
  import { ScreenTypes } from '../logic/screens'
  import { screen } from '../stores/store'
  import SvelteMarkdown from 'svelte-markdown'

  let markdown = ''

  export let config

  $: {
    if (config?.welcome?.markdownFile) {
      ;(async () => {
        markdown = await (
          await fetch(config.basePath + config.welcome.markdownFile)
        ).text()
      })()
    }
  }
</script>

<div
  class="relative w-sm min-h-sm shadow-md rounded-md bg-white w-xs px-5 justify-self-center flex flex-col justify-between"
>
  <div>
    <SvelteMarkdown source={markdown} />
  </div>
  <button
    class="mt-10 mb-5 w-full p-3 bg-transparent rounded-lg cursor-pointer border border-solid border-width-2 border-green-500 text-green-500 font-light text-5xl uppercase hover:(bg-green-500 text-white) active:bg-green-600"
    on:click={() => ($screen = ScreenTypes.Swiper)}>Start</button
  >
</div>

<style>
  button {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style>
