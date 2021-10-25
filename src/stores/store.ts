import { ScreenTypes } from '../logic/screens'
import { writable } from 'svelte/store'

export const answers = writable([])
export const imgList = writable([])
export const screen = writable(ScreenTypes.Welcome)
