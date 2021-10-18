<script lang="ts">
  import { mdiThumbUpOutline, mdiThumbDownOutline } from '@mdi/js'
  import { fade } from 'svelte/transition'
  import SvgIcon from './icons/SvgIcon.svelte'
  import Motion from 'svelte-motion/src/motion/MotionSSR.svelte'
  import { useTransform, useMotionValue } from 'svelte-motion'
  import { shuffle } from '../logic/utils'
  import { ScreenTypes } from '../logic/screens'
  import { screen, points, imgList } from '../stores/store'

  export let config

  const POINT_INCREMENT = 1
  const EMPTY_IMAGE =
    'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

  let currentImage = EMPTY_IMAGE
  let currentSolution = ''

  let imgIndex = -1

  const x = useMotionValue(0)
  const xInput = [-30, 0, 30]
  const color = useTransform(x, xInput, ['#f33', 'rgb(68, 0, 255)', '#1c2'])
  const tickPath = useTransform(x, [10, 30], [0, 1])
  const crossPathA = useTransform(x, [-10, -20], [0, 1])
  const crossPathB = useTransform(x, [-20, -30], [0, 1])
  let xRot = 0
  x.onChange((change) => {
    xRot = (0.2 * change) / (2 * Math.PI)
  })
  type StrokeCap = 'butt' | 'round'
  let capA: StrokeCap = 'butt'
  crossPathA.onChange((change) => (capA = change > 0 ? 'round' : 'butt'))
  let capB: StrokeCap = 'butt'
  crossPathB.onChange((change) => (capB = change > 0 ? 'round' : 'butt'))
  let capTick: StrokeCap = 'butt'
  tickPath.onChange((change) => (capTick = change > 0 ? 'round' : 'butt'))

  function dragEnd(x) {
    if (x.current <= -30) {
      no()
    } else if (x.current >= 30) {
      yes()
    }
  }

  function givePoints(answer, solution) {
    if (answer === solution) {
      $points += POINT_INCREMENT
    }
  }
  function yes() {
    givePoints('yes', currentSolution)
    nextImage()
  }

  function no() {
    givePoints('no', currentSolution)
    nextImage()
  }

  function nextImage() {
    imgIndex++
    if (imgIndex < $imgList.length) {
      const current = $imgList[imgIndex]
      currentImage = current.url
      currentSolution = current.solution
    } else {
      $screen = ScreenTypes.Results
    }
  }

  $: {
    if (config?.swiper?.images) {
      $imgList = shuffle(config.swiper.images.map(img=>({...img, url: config.basePath + img.url}))).slice(
        0,
        config.swiper.howManyToShow,
      )
      nextImage()
    }
  }
</script>

<div class="relative mt-5 block w-xs p-3 justify-self-center flex justify-end">
  <span class="font-light block" style="align-self: center"
    >{Math.max(imgIndex, 0)}/{$imgList.length}</span
  >
</div>

<div class="relative w-xs h-xs ml-5 mb-15 no-touch">
  <div class="absolute">
    <div
      class="absolute ml-1 mt-1 transform rotate-1 shadow-md rounded-md bg-gray-100 block w-xs h-xs p-3 justify-self-center select-none active:shadow-sm transition-shadow"
    />
    <div
      class="absolute ml-0.5 mt-0.5 transform rotate-2.5 shadow-md rounded-md bg-gray-50 block w-xs h-xs p-3 justify-self-center select-none active:shadow-sm transition-shadow"
    />
  </div>
  <Motion
    drag="x"
    dragConstraints={{ left: 0, right: 0 }}
    style={{ x, rotate: xRot }}
    dragTransition={{ bounceStiffness: 6000, bounceDamping: 250 }}
    onDragEnd={() => dragEnd(x)}
    let:motion
  >
    <div
      class="absolute z-10 shadow-md rounded-md bg-white block w-xs h-xs p-3 justify-self-center select-none transition-shadow"
      use:motion
    >
      <svg
        class="absolute left-0 top-0 z-10"
        viewBox="0 0 50 50"
        fill="none"
        stroke-width="2"
      >
        <Motion
          isSVG={true}
          let:motion={m}
          style={{ pathLength: tickPath }}
          stroke={color}
        >
          <path use:m d="M14,26 L 22,33 L 35,16" stroke-linecap={capTick} />
        </Motion>
        <Motion
          isSVG={true}
          let:motion={m}
          stroke={color}
          style={{ pathLength: crossPathA }}
        >
          <path use:m d="M17,17 L33,33" stroke-linecap={capA} />
        </Motion>
        <Motion
          isSVG={true}
          let:motion={m}
          style={{ pathLength: crossPathB }}
          stroke={color}
        >
          <path use:m d="M33,17 L17,33" stroke-linecap={capB} />
        </Motion>
      </svg>
      <div class="relative w-full h-full">
        {#key currentImage}
          <img
            transition:fade|local={{ duration: 150 }}
            class="inset-0 w-full h-full absolute object-none rounded-xs pointer-events-none image-render-pixel"
            src={currentImage}
            alt=""
          />
        {/key}
      </div>
    </div>
  </Motion>
</div>
<div class="relative w-sm mx-6 block justify-self-center flex justify-between">
  <button class="ml-5 button" aria-label="No" on:click={no}>
    <SvgIcon d={mdiThumbDownOutline} fill={'#f33'} />
  </button>
  <span class="font-semibold block p-3" style="align-self: center">Real?</span>
  <button class="mr-5 button" aria-label="No" on:click={yes}>
    <SvgIcon d={mdiThumbUpOutline} fill={'#1c2'} />
  </button>
</div>

<style>
  .button {
    @apply bg-transparent p-6 shadow-md rounded-lg bg-white hover:bg-gray-100 border-none w-24 h-24 cursor-pointer flex items-center active:shadow-sm transition-shadow;
  }
  .no-touch {
    touch-action: none;
  }
</style>
