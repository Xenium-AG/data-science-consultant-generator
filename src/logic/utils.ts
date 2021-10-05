export function shuffle(array) {
  const arrayClone = array.slice()
  let currentIndex = arrayClone.length,
    randomIndex
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[arrayClone[currentIndex], arrayClone[randomIndex]] = [
      arrayClone[randomIndex],
      arrayClone[currentIndex],
    ]
  }
  return arrayClone
}