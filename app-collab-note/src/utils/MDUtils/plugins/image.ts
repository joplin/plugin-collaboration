import { Resource } from 'utils/types';

function plugin(resources: Resource[]) {

  const resourceMap = new Map();
  resources.forEach(resource => {
    resourceMap.set(resource.id, resource.dataURI);
  });

  function plugin(markdownIt: any) {
    const defaultRender = markdownIt.renderer.rules.image;

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
          return `<img src=${dataUri} title=${title}/>`;
        }
      }
      
      return defaultRender(tokens, idx, options, env, self);
    };
  }

  return plugin;
}

export default { plugin };
