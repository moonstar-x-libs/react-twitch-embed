export const clearElementById = (id: string): void => {
  const container = document.querySelector(`#${id}`);
  if (container) {
    container.replaceChildren();
  }
};
