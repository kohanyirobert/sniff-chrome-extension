const DEBUG = false

function sendPost(apiUrl, apiKey, postBody) {
  if (DEBUG) {
    alert('DEBUG')
    return
  }
  var xhr = new XMLHttpRequest()
  xhr.open('POST', apiUrl, true)
  xhr.setRequestHeader('x-api-key', apiKey)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status >= 200 && xhr.status < 300) {
        alert('OK')
      } else {
        alert('ERROR')
      }
    }
  }
  xhr.send(JSON.stringify(postBody))
}

function trySendPost(apiUrl, apiKey, postBody) {
  let permission = {origins: [apiUrl]}
  chrome.permissions.contains(permission, (result) => {
    if (result) {
      sendPost(apiUrl, apiKey, postBody)
    } else {
      chrome.permissions.getAll((permissions) => {
        chrome.permissions.remove({origins: permissions.origins}, (removed) => {
          chrome.permissions.request(permission, (granted) => {
            if (granted) {
              sendPost(apiUrl, apiKey, postBody)
            } else {
              alert('NOT PERMITTED')
            }
          })
        })
      })
    }
  })
}

let condition = new chrome.declarativeContent.PageStateMatcher({
  pageUrl: {
    schemes: ['https'],
    hostEquals: 'www.youtube.com',
    pathEquals: '/watch',
    queryContains: 'v=',
  },
  css: ['video'],
})

let rule = {
  conditions: [condition],
  actions: [new chrome.declarativeContent.ShowPageAction()],
}

chrome.runtime.onInstalled.addListener(() => {

  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([rule])
  })
})

chrome.tabs.onActivated.addListener((activeInfo) => {
  let queryInfo = {
    active: true,
    currentWindow: true,
    url: 'https://www.youtube.com/watch?v=*'
  }
  chrome.tabs.query(queryInfo, (tabs) => {
    if (tabs.length === 1) {
      chrome.contextMenus.create({
        id: ARTIST_ID,
        title: 'Artist',
        contexts: ['selection'],
      })
      chrome.contextMenus.create({
        id: TITLE_ID,
        title: 'Title',
        contexts: ['selection'],
      })
    } else {
      chrome.contextMenus.removeAll()
    }
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  let normalizedUrl = normalizeUrl(info.pageUrl)
  chrome.storage.local.get(normalizedUrl, (items) => {
    if (!items[normalizedUrl]) {
      items[normalizedUrl] = {}
    }
    items[normalizedUrl][info.menuItemId] = info.selectionText
    chrome.storage.local.set(items, () => {
    })
  })
})

chrome.extension.onMessage.addListener((request, sender, sendResponse) => {

  let keys = [
    OPTION_API_URL,
    OPTION_API_KEY,
  ]

  chrome.storage.sync.get(keys, function(items) {
    trySendPost(items[OPTION_API_URL], items[OPTION_API_KEY], request)
  })
})
