const ARTIST_ID = 'ARTIST'
const TITLE_ID = 'TITLE'

const OPTION_API_KEY = 'api-key'
const OPTION_API_URL = 'api-url'

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
