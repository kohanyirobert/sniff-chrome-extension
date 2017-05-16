const ARTIST_ID = 'ARTIST'
const TITLE_ID = 'TITLE'

const OPTION_API_KEY = 'api-key'
const OPTION_API_URL = 'api-url'

const ALL_OPTION_KEYS = [
  OPTION_API_URL,
  OPTION_API_KEY,
]

function normalizeUrl(originalUrl) {
  let params = new URLSearchParams()
  params.set('v', new URL(originalUrl).searchParams.get('v'))
  let normalizedUrl = new URL('https://www.youtube.com/watch')
  normalizedUrl.search = params.toString()
  return normalizedUrl.toString()
}

function findArtistAndTitle(videoTitle) {
  let parts = videoTitle.split(/[-]/)
  if (parts.length !== 2) {
    return null
  }
  return {
    [ARTIST_ID]: parts[0].trim(),
    [TITLE_ID]: parts[1].trim(),
  }
}

function checkNeedToShopOptions(callback) {
  chrome.storage.sync.get(ALL_OPTION_KEYS, (items) => {
    if (items[OPTION_API_KEY] && items[OPTION_API_URL]) {
      callback(false)
    } else {
      callback(true)
    }
  })
}
