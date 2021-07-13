import MarkdownIt from 'markdown-it';
import { Resource } from 'utils/types';
import image from './plugins/image';

export function render(mdText: string, resources: Resource[]): string {
  const markdownIt = new MarkdownIt();
  markdownIt.set({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
  });

  markdownIt.use(image.plugin(resources));

  return markdownIt.render(mdText);
}
