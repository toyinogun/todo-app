// Signature move: the folio in the margin is a to do list of the page's
// chapters. Passing a chapter ticks its item; the closing chapter hands the
// folio over to the real demo. Ticks are one way, like reading.
export const mountFolio = (root: Document = document): void => {
  const folio = root.querySelector<HTMLElement>('.folio')
  const chapters = Array.from(
    root.querySelectorAll<HTMLElement>('[data-chapter]'),
  )
  if (!folio || chapters.length === 0 || !('IntersectionObserver' in window))
    return

  const itemFor = (ch: HTMLElement) =>
    folio.querySelector<HTMLElement>(`[data-for="${ch.id}"]`)

  const observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        const ch = e.target as HTMLElement
        const at = chapters.indexOf(ch)
        chapters
          .slice(0, at)
          .forEach((prev) => itemFor(prev)?.setAttribute('data-done', ''))
        chapters.forEach((c) => itemFor(c)?.removeAttribute('aria-current'))
        itemFor(ch)?.setAttribute('aria-current', 'true')
        folio.classList.toggle('folio--handed', ch.dataset.chapter === 'close')
        if (ch.dataset.chapter === 'close')
          itemFor(ch)?.setAttribute('data-done', '')
      }
    },
    // The middle line of the viewport decides which chapter is current.
    { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
  )
  chapters.forEach((ch) => observer.observe(ch))
}
