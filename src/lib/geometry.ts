/** Layout rect of `el` relative to `root`, ignoring CSS transforms (walks the offsetParent chain). */
export function offsetRect(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
