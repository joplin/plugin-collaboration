import MarkdownIt from 'markdown-it';

export function render(mdText: string) {
  const markdownIt = new MarkdownIt();
  return markdownIt.render(mdText);
}
