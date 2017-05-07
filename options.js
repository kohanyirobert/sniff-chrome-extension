function saveOptions() {
  let options = {
    [OPTION_API_URL]: document.getElementById(OPTION_API_URL).value,
    [OPTION_API_KEY]: document.getElementById(OPTION_API_KEY).value,
  }

  chrome.storage.sync.set(options)
}

function restoreOptions() {
  let apiUrlInput = document.getElementById(OPTION_API_URL)
  let apiKeyInput = document.getElementById(OPTION_API_KEY)

  let keys = [
    OPTION_API_URL,
    OPTION_API_KEY,
  ]

  chrome.storage.sync.get(keys, (items) => {
    apiUrlInput.value = items[OPTION_API_URL]
    apiKeyInput.value = items[OPTION_API_KEY]
  })
}

document.addEventListener('DOMContentLoaded', () => {
  restoreOptions()
  document.getElementById('save').addEventListener('click', saveOptions)
  document.getElementById('reset').addEventListener('click', restoreOptions)
})
