import { Resource } from 'utils/types';
import MarkdownIt from 'markdown-it';

function plugin(resources: Resource[]): (markdownIt: MarkdownIt) => void {

  const resourceMap = new Map();
  resources.forEach(resource => {
    resourceMap.set(resource.id, resource.dataURI);
  });

  function plugin(markdownIt: MarkdownIt) {
    const defaultRender = markdownIt.renderer.rules.image as any;

    function getAttr(attrs: string[][], name: string) {
      for(const i in attrs) {
        const attr = attrs[i];
        if(attr[0] === name) return attr.length > 1 ? attr[1] : ''; 
      }

      return '';
    }

    markdownIt.renderer.rules.image = (tokens: any[], idx: number, options: any, env: any, self: any) => {

      const token = tokens[idx];
      const src = getAttr(token.attrs, 'src');
      const title = getAttr(token.attrs, 'title');

      console.log({ token });

      if (src.startsWith(':/')) {
        const dataUri = resourceMap.get(src.substring(2));
        if(dataUri) {
          return `<img src="${dataUri}" title="${title}" style="max-width: 100%"/>`;
        }
      }
      
      return defaultRender(tokens, idx, options, env, self);
    };
  }

  return plugin;
}

export default { plugin };
