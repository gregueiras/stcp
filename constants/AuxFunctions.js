export async function fetchURL(searchUrl) {
  const response = await fetch(searchUrl); // fetch page
  const text = await response.text(); // get response text

  return text;
}
