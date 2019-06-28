export async function fetchURL(searchUrl) {
  const response = await global.fetch(searchUrl); // fetch page
  const text = await response.text(); // get response text

  return text;
}
