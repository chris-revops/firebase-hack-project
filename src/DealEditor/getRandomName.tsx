import { names } from "./names";

export const getRandomName = () => {
  return `${names[Math.floor(Math.random() * names.length)]}-${
    names[Math.floor(Math.random() * names.length)]
  }`;
};
