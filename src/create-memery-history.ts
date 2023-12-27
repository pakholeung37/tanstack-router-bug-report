import { createHistory } from "@tanstack/react-router";

export function createMemoryHistory(
    opts: {
      initialEntries: string[];
      initialIndex?: number;
    } = {
      initialEntries: ["/"],
    }
  ) {
    const entries = opts.initialEntries;
    let index = opts.initialIndex ?? entries.length - 1;
    let currentState = {
      key: createRandomKey(),
    };
    const getLocation = () => parseHref(entries[index], currentState);
    return createHistory({
      getLocation,
      pushState: (path, state, onUpdate) => {
        currentState = state;
        entries.push(path);
        index++;
        onUpdate();
      },
      replaceState: (path, state, onUpdate) => {
        currentState = state;
        entries[index] = path;
        onUpdate();
      },
      back: (onUpdate) => {
        index--;
        onUpdate?.();
      },
      forward: (onUpdate) => {
        index = Math.min(index + 1, entries.length - 1);
        onUpdate?.();
      },
      go: (n, onUpdate) => {
        index = Math.min(Math.max(index + n, 0), entries.length - 1);
        onUpdate?.();
      },
      createHref: (path) => path,
    });
  }
  
  function parseHref(href: string, state: any) {
    let hashIndex = href.indexOf("#");
    let searchIndex = href.indexOf("?");
    return {
      href,
      pathname: href.substring(
        0,
        hashIndex > 0
          ? searchIndex > 0
            ? Math.min(hashIndex, searchIndex)
            : hashIndex
          : searchIndex > 0
          ? searchIndex
          : href.length
      ),
      hash: hashIndex > -1 ? href.substring(hashIndex) : "",
      search:
        searchIndex > -1
          ? href.slice(searchIndex, hashIndex === -1 ? void 0 : hashIndex)
          : "",
      state: state || {},
    };
  }
  
  function createRandomKey() {
    return (Math.random() + 1).toString(36).substring(7);
  }
  