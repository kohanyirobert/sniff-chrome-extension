(() => {
  let elements = document.querySelectorAll('h1.title')
  if (elements.length === 1) {
    return elements[0].textContent.trim()
  }
  return null
})()
