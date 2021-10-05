<script lang="ts">
  import { mdiThumbUp, mdiThumbDown } from '@mdi/js'
  import SvgIcon from './components/icons/SvgIcon.svelte'
  import Motion from 'svelte-motion/src/motion/MotionSSR.svelte';
  import {  useTransform, useMotionValue } from 'svelte-motion'
  import { shuffle } from './logic/utils'

  const POINT_INCREMENT = 100
  const EMPTY_IMAGE =
    'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

  let currentImage = EMPTY_IMAGE
  let currentSolution = ''
  let currentPoints = 0

  let imgList = []
  let imgIndex = -1

  const x = useMotionValue(0)
  const xInput = [-30, 0, 30]
  const color = useTransform(x, xInput, ['#f33', 'rgb(68, 0, 255)', '#1c2'])
  const tickPath = useTransform(x, [10, 30], [0, 1])
  const crossPathA = useTransform(x, [-10, -20], [0, 1])
  const crossPathB = useTransform(x, [-15, -30], [0, 1])
  let xRot = 0
  x.onChange((change) => {
    xRot = (0.2 * change) / (2 * Math.PI)
  })

  function dragEnd(x) {
    if (x.current <= -30) {
      no()
    } else if (x.current >= 30) {
      yes()
    }
  }

  function givePoints(answer, solution) {
    if (answer === solution) {
      currentPoints += POINT_INCREMENT
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
    if (imgIndex < imgList.length) {
      const current = imgList[imgIndex]
      currentImage = current.url
      currentSolution = current.solution
    } else {
      alert('FERTISCH!')
    }
  }

  ;(async () => {
    const config = await (await fetch('/data/config.json')).json()
    imgList = shuffle(config.images)
    nextImage()
  })()
</script>

<main class="max-w-sm w-full m-auto grid grid-cols-1 gap-3">
  <div
    class="relative shadow-md rounded-md bg-white block w-xs p-3 justify-self-center flex justify-between space-x-9"
  >
    <label class="font-semibold block" style="align-self: center"
      >Beantwortet</label
    >
    <label class="font-semibold block" style="align-self: center"
      >{Math.max(imgIndex, 0)}/{imgList.length}</label
    >
  </div>
  <Motion
    drag="x"
    dragConstraints={{ left: 0, right: 0 }}
    style={{ x, rotate: xRot }}
    onDragEnd={() => dragEnd(x)}
    let:motion
  >
    <div
      class="relative shadow-md rounded-md bg-white block w-xs h-xs p-3 justify-self-center select-none"
      use:motion
    >
      <svg
        class="absolute left-0 top-0"
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
          <path use:m d="M14,26 L 22,33 L 35,16" />
        </Motion>
        <Motion
          isSVG={true}
          let:motion={m}
          stroke={color}
          style={{ pathLength: crossPathA }}
        >
          <path use:m d="M17,17 L33,33" />
        </Motion>
        <Motion
          isSVG={true}
          let:motion={m}
          style={{ pathLength: crossPathB }}
          stroke={color}
        >
          <path use:m d="M33,17 L17,33" />
        </Motion>
      </svg>
      <img class="w-full h-full object-cover " src={currentImage} alt="" />
    </div>
  </Motion>

  <div
    class="relative shadow-md rounded-md bg-white block w-xs p-3 justify-self-center flex justify-between space-x-9"
  >
    <button
      class="button transition-opacity z-20"
      aria-label="No"
      on:click={no}
    >
      <SvgIcon d={mdiThumbDown} dim={{ w: 24, h: 24 }} fill={'#f33'} />
    </button>
    <label class="font-semibold block" style="align-self: center"
      >Xenianer?</label
    >
    <button
      class="button transition-opacity z-20"
      aria-label="No"
      on:click={yes}
    >
      <SvgIcon d={mdiThumbUp} dim={{ w: 24, h: 24 }} fill={'#1c2'} />
    </button>
  </div>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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
    touch-action: none;
  }
  .button {
    @apply bg-transparent hover:bg-gray-100 rounded border-none w-10 h-10 cursor-pointer flex items-center p-1;
  }
</style>
