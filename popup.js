function disableForm(fieldsets) {
  fieldsets.forEach(f => f.disabled = true)
}

function enableForm(fieldsets) {
  fieldsets.forEach(f => f.disabled = false)
}

function getFormData(tagsForm) {
  let tagRows = document.querySelectorAll('.tag-row')
  return Array.from(tagRows).reduce((r, e) => {
    let name = e.querySelector('.tag-name').value
    let value = e.querySelector('.tag-value').value
    r[name.toUpperCase()] = value
    return r
  }, {})
}

function createTagRow(url, tagsFieldset, context) {
  let tagRowDiv = document.createElement('div')
  tagRowDiv.classList.add('tag-row')

  let tagNameInput = document.createElement('input')
  tagNameInput.type = 'text'
  tagNameInput.required = true
  tagNameInput.placeholder = 'Tag name'
  tagNameInput.classList.add('tag-col')
  tagNameInput.classList.add('tag-name')

  let tagValueInput = document.createElement('input')
  tagValueInput.type = 'text'
  tagValueInput.required = true
  tagValueInput.autocomplete = false
  tagValueInput.placeholder = 'Tag value'
  tagValueInput.classList.add('tag-col')
  tagValueInput.classList.add('tag-value')
  tagValueInput.addEventListener('keyup', (event) => {
    if (tagNameInput.value) {
      context[tagNameInput.value] = tagValueInput.value
      chrome.storage.local.set({[url]: context}, () => {
        console.log('SAVING', context)
      })
    }
  })

  let tagRemoveButton = document.createElement('input')
  tagRemoveButton.type = 'button'
  tagRemoveButton.value = 'Remove'
  tagRemoveButton.addEventListener('click', () => {
    tagsFieldset.removeChild(tagRowDiv)
  })

  tagRowDiv.append(tagNameInput)
  tagRowDiv.append(tagValueInput)
  tagRowDiv.append(tagRemoveButton)

  return tagRowDiv
}

function addArtistTagField(url, tagsFieldset, addButton, context) {
  let tagRowDiv = createTagRow(url, tagsFieldset, context)
  tagRowDiv.querySelector('.tag-name').value = 'ARTIST'
  tagRowDiv.querySelector('.tag-value').value = context[ARTIST_ID] || null
  tagsFieldset.insertBefore(tagRowDiv, addButton)
}

function addTitleTagField(url, tagsFieldset, addButton, context) {
  let tagRowDiv = createTagRow(url, tagsFieldset, context)
  tagRowDiv.querySelector('.tag-name').value = 'TITLE'
  tagRowDiv.querySelector('.tag-value').value = context[TITLE_ID] || null
  tagsFieldset.insertBefore(tagRowDiv, addButton)
}

function setupTagsForm(url, context) {
  let tagsForm = document.getElementById('tags')
  let tagsFieldset = tagsForm.querySelector('fieldset')
  let addButton = document.getElementById('add')

  addArtistTagField(url, tagsFieldset, addButton, context)
  addTitleTagField(url, tagsFieldset, addButton, context)

  addButton.addEventListener('click', () => {
    let tagRowDiv = createTagRow(url, tagsFieldset, context)
    tagsFieldset.insertBefore(tagRowDiv, addButton)
  })

  tagsForm.addEventListener('submit', event => {
    event.preventDefault()

    var message = {
      version: chrome.runtime.getManifest().version,
      url: url,
      tags: getFormData(tagsForm),
    }

    let fieldsets = Array.from(document.querySelectorAll('fieldset'))
    disableForm(fieldsets)

    chrome.runtime.sendMessage(message, (response) => {
      enableForm(fieldsets)
      window.close()
    })
  })
}

document.addEventListener('DOMContentLoaded', (event) => {
  checkNeedToShopOptions((needToShow) => {
    if (needToShow) {
      chrome.runtime.openOptionsPage()
    } else {
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        let normalizedUrl = normalizeUrl(tabs[0].url)

        chrome.tabs.executeScript(null, {file: 'script.js'}, (results) => {
          let videoTitle = results[0]
          let artistAndTitle = findArtistAndTitle(videoTitle)
          chrome.storage.local.get(normalizedUrl, (items) => {
            let context = items[normalizedUrl] || artistAndTitle || {}
            setupTagsForm(normalizedUrl, context)
          })
        })
      })
    }
  })
})
