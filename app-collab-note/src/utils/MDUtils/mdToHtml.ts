import MarkdownIt from 'markdown-it';
import { Resource } from 'utils/types';
import image from './plugins/image';

export function render(mdText: string, resources: Resource[]) {
  const markdownIt = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
  });

  markdownIt.use(image.plugin(resources));

  return markdownIt.render(mdText);
}
