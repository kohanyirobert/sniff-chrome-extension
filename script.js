(() => {
  let elements = document.querySelectorAll('.watch-title-container')
  if (elements.length === 1) {
    return elements[0].textContent.trim()
  }
  return null
})()
