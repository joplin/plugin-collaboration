import { Resource } from 'utils/types';
import { render } from './mdToHtml';
import imageNotFound from './plugins/image-not-found.svg';

describe('mdToHtml', () => {
  it('should map resource ids to actual image URIs', () => {
    const resources: Resource[] = [
      { id: 'resourceId1', title: 'test1.png', dataURI: '://dummyUriasfaxkjhfskujhafs'}
    ]
    const testMd = '![](:/resourceId1)';
    const expectedHtml = `.*<img src="://dummyUriasfaxkjhfskujhafs".*`;
    const html = render(testMd ,resources);
    expect(html).toEqual(expect.stringMatching(new RegExp(expectedHtml)));
  });

  it('should map resource id which is not present to image-not-found.svg', () => {
    const testMd = '![](:/resourceId1)';
    const expectedHtml = `.*<img src="${imageNotFound}".*`;
    const html = render(testMd ,[]);
    expect(html).toEqual(expect.stringMatching(new RegExp(expectedHtml)));
  })
});