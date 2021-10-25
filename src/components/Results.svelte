<script lang="ts">
  import Motion from 'svelte-motion/src/motion/MotionSSR.svelte'
  import { mdiRobot, mdiAccount } from '@mdi/js'
  import { transform, useMotionValue } from 'svelte-motion'
  import { answers, imgList } from '../stores/store'
  import SvgIcon from './icons/SvgIcon.svelte'
  export let config
  const x = useMotionValue(0)
  let color = '#fff'
  $: color = transform(0.5, [0, 1], ['#f33', '#1c2'])
  let points
  $: points = $answers.reduce(
    (ans, val, i) => ($imgList[i].solution === val ? ans + 1 : ans),
    0,
  )
  console.log(points)
  let successFraction = 1
  let max = 1
  let circleVariants = {}
  let comment = ''
  let loaded = false
  let images = []

  let progress = 0

  const moveProgress = () => {
    progress = 0

    const interval = setInterval(() => {
      progress += 1
      if (progress === points) {
        clearInterval(interval)
      }
    }, (1000 / (points + 1)) | 0)
  }
  const padProgress = (progress, max) => {
    return progress.toString().padStart(('' + max).length, '0')
  }

  const showText = () => {
    const comments = config.results.comments.filter(
      (q) => successFraction >= q.minFraction,
    )

    if (comments.length > 0) {
      comment = comments[comments.length - 1].text
    } else {
      comment = ''
    }
  }
  $: {
    if (config?.swiper?.howManyToShow ?? 0 > 0) {
      loaded = true
      max = config.swiper.howManyToShow
      images = config.swiper.images
      successFraction = points / max
      circleVariants = {
        hidden: {
          opacity: 1,
          pathLength: 0,
          stroke: '#ee2',
        },
        visible: {
          opacity: 1,
          pathLength: successFraction,
          stroke: '#1c2',
          transition: {
            duration: 1,
            ease: 'easeInOut',
          },
        },
      }
      moveProgress()
      showText()
    }
  }
</script>

<div
  class="relative w-sm min-h-sm shadow-md rounded-md bg-white w-xs p-3 my-3 justify-self-center flex flex-col justify-between"
>
  <h1 class="text-center mt-2">Ergebnisse</h1>
  <div class="relative flex w-64 h-64 self-center">
    <svg
      class="absolute left-0 top-0 z-10 w-full h-full"
      viewBox="0 0 50 50"
      fill="none"
      stroke-width="3"
      stroke-linecap="round"
    >
      <Motion
        isSVG={true}
        let:motion={m}
        style={{ translateX: 5, translateY: 5, rotate: 90 }}
        stroke={color}
        variants={circleVariants}
        initial="hidden"
        animate={loaded ? 'visible' : 'hidden'}
      >
        <path use:m d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0" />
        <text
          font-size="70%"
          x="50%"
          y="50%"
          dominant-baseline="middle"
          text-anchor="middle"
          fill="#111">{padProgress(progress, max)}/{max}</text
        >
      </Motion>
    </svg>
  </div>
  <div class="my-10 h-15 text-center mx-4" style="align-self: center">
    {comment}
  </div>
  <button
    class="mt-10 mb-5 w-full p-3 bg-transparent rounded-lg cursor-pointer border border-solid border-width-2 border-green-500 text-green-500 font-light text-3xl uppercase hover:(bg-green-500 text-white) active:bg-green-600"
    on:click={() => window.location.reload()}>Neuer Versuch</button
  >
</div>
<div
  class="relative w-sm shadow-md rounded-md bg-white w-xs p-3 mb-3 justify-self-center flex flex-col justify-between"
>
  <h1 class="text-center mt-2">Auflösung</h1>
  <div class="flex flex-wrap">
    {#each $imgList as { url, solution }, i}
      <div class="relative w-20 h-20">
        <img
          class="inset-0 w-full h-full rounded-xs absolute object-cover pointer-events-none"
          src={url}
          alt=""
        />
        {#if solution === 'yes'}
          <span class="absolute w-5 h-5 p-1 rounded-br-5px bg-light-50 bg-opacity-50">
            <SvgIcon d={mdiAccount} fill={'#384BFF'} /></span
          >
        {:else}
          <span class="absolute w-5 h-5 p-1 rounded-br-5px bg-light-50 bg-opacity-50">
            <SvgIcon d={mdiRobot} fill={'#115'} /></span
          >
        {/if}
        {#if solution === $answers[i]}
        
          <svg
            class="absolute left-2 top-2 w-5 z-10"
            viewBox="0 0 40 40"
            fill="none"
            stroke-width="5"
            stroke="#1c2"
            stroke-linecap="round"
          >
            <path d="M14,26 L 22,33 L 35,16" />
          </svg>
        {:else}
          <svg
            class="absolute left-2 top-2 w-5 z-10"
            viewBox="0 0 40 40"
            fill="none"
            stroke-width="5"
            stroke="#f33"
            stroke-linecap="round"
          >
            <path d="M17,17 L33,33" />
            <path d="M33,17 L17,33" />
          </svg>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  svg,
  button {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    @apply tabular-nums;
  }
</style>
