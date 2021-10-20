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

export async function logPageView() {
  try {
    const url = new URL('https://www.xenium.com/piwik/piwik.php')
    const now = new Date()
    const params = {
      action_name: `[DATA SCIENCE] ${document.title}`,
      idsite: '1',
      rec: '1',
      r: String(Math.random()).slice(2, 8),
      h: now.getHours().toString(),
      m: now.getMinutes().toString(),
      s: now.getSeconds().toString(),
      url: window.location.origin + window.location.pathname,
      send_image: '1',
    }
    url.search = new URLSearchParams(params).toString()
    return await fetch(url.toString(), {
      headers: { 'sec-fetch-mode': 'no-cors' },
    })
  } catch (ex) {
    console.error(ex)
  }
  return null
}
