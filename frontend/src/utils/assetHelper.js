export const getImageUrl = (path) => {
  const relativePath = `/src/assets/${path}`;
  return new URL(relativePath , import.meta.url).href;

};