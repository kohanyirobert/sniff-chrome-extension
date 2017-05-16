const FADE_MILLISECONDS = 750

function showStatus(text) {
  let statusSpan = document.getElementById('status')
  statusSpan.textContent = text
  setTimeout(() => statusSpan.textContent = '', FADE_MILLISECONDS)
}

function saveOptions() {
  let apiUrlInput = document.getElementById(OPTION_API_URL)
  let apiKeyInput = document.getElementById(OPTION_API_KEY)

  if (apiUrlInput.value === '' || apiKeyInput.value === '') {
    showStatus('Not saved')
    return
  }

  let options = {
    [OPTION_API_URL]: apiUrlInput.value,
    [OPTION_API_KEY]: apiKeyInput.value,
  }

  chrome.storage.sync.set(options, () => {
    showStatus('Saved')
  })
}

function restoreOptions() {
  let apiUrlInput = document.getElementById(OPTION_API_URL)
  let apiKeyInput = document.getElementById(OPTION_API_KEY)

  chrome.storage.sync.get(ALL_OPTION_KEYS, (items) => {
    apiUrlInput.value = items[OPTION_API_URL] || ''
    apiKeyInput.value = items[OPTION_API_KEY] || ''
  })
}

document.addEventListener('DOMContentLoaded', () => {
  restoreOptions()
  document.getElementById('save').addEventListener('click', saveOptions)
  document.getElementById('reset').addEventListener('click', restoreOptions)
})
