// Types for the vendored engine (scrollcraft.js). The file itself is never edited.
declare global {
  interface Window {
    readonly ScrollCraft: { readonly mount: (root: Element) => void }
  }
}
export {}
