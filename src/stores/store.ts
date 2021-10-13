import { ScreenTypes } from '../logic/screens'
import { writable } from 'svelte/store'

export const points = writable(0)
export const imgList = writable([])
export const screen = writable(ScreenTypes.Welcome)
