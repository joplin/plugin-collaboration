import { FOUND, INVALID_TOKEN, SEARCHING, NOT_FOUND } from './clipperPortStatus';
import { config } from './config';

let clipperServerPortStatus_;
let clipperServerPort_;
let authToken_;

async function init(authToken) {
  const initPort = config().startPort;

  clipperServerPortStatus_ = NOT_FOUND;
  clipperServerPort_ = null;
  authToken_ = authToken;

  await findClipperServerPort(initPort);
}

async function findClipperServerPort(initPort) {
  let port = initPort;

  clipperServerPortStatus_ = SEARCHING;
  for (let i = 0; i < 10; i++) {
    try {
      let response = await fetch(`http://127.0.0.1:${port}/ping`);
      const text = await response.text();
      if (text.trim() === 'JoplinClipperServer') {
        clipperServerPortStatus_ = FOUND;
        clipperServerPort_ = port;

        const token = authToken_;
        return clipperApiExec('GET', 'notes', { token })
          .catch(() => {
            clipperServerPortStatus_ = INVALID_TOKEN;
            throw new Error('Invalid Token');
          });
      }
    } catch (error) {
      console.log(error.message);
    }

    port += 1;
  }

  clipperServerPortStatus_ = NOT_FOUND;
  throw new Error('Clipper Server not found!');
}

function clipperServerBaseUrl() {
  if (!clipperServerPort_ || clipperServerPortStatus_ !== FOUND) return;
  return `http://127.0.0.1:${clipperServerPort_}`;
}

async function clipperApiExec(method, path, query, body, responseType) {
  if (!clipperServerPort_ || clipperServerPortStatus_ !== FOUND) throw new Error('Clipper Server not found!');

  const baseUrl = clipperServerBaseUrl();

  if (!baseUrl) throw new Error('Missing Data API URL!!');

  const fetchOptions = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);

  query.token = authToken_;

  let queryString = '';
  if (query) {
    const s = [];
    for (const k in query) {
      if (!Object.prototype.hasOwnProperty.call(query, k)) continue;
      s.push(`${encodeURIComponent(k)}=${encodeURIComponent(query[k])}`);
    }
    queryString = s.join('&');
    if (queryString) queryString = `?${queryString}`;
  }

  const response = await fetch(`${baseUrl}/${path}${queryString}`, fetchOptions);
  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg);
  }

  if(responseType === 'blob') {
    const blob = await response.blob();
    return blob;
  }

  const json = await response.json();
  return json;
}

async function updateNoteContent(note) {
  const { id, body, title } = note;
  if (!id) throw new Error('Cannot update a note without id');
  return clipperApiExec('PUT', `notes/${id}`, {}, { body, title });
}

async function getNote(id, fields = []) {
  if (!id) throw new Error('Cannot get a note without id');
  return clipperApiExec('GET', `notes/${id}`, { fields: fields.join(',') });
}

async function getNoteResourceList(noteId) {
  if (!noteId) throw new Error('Cannot get resource list without note id');
  let resourceList = [];
  let hasMore = true;
  let page = 1;
  while(hasMore) {
    const resp = await clipperApiExec('GET', `notes/${noteId}/resources`, { page });
    resourceList = [...resourceList, ...resp.items];
    hasMore = resp.has_more;
    page++;
  }

  for(const i in resourceList) {
    try {
      const blob = await getResouceFile(resourceList[i].id);
      resourceList[i].dataURI = await getDataURI(blob);
    }
    catch(error) {
      console.warn(`Error while fetching resource file: ${error.message}`);
    }
  }
  
  return resourceList;
}

async function getResouceFile(resourceId) {
  if (!resourceId) throw new Error('Cannot get resource file without resource id');
  return clipperApiExec('GET', `/resources/${resourceId}/file`, {}, null, 'blob');
}

function getDataURI(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const bridge = {
  init,
  getNote,
  updateNoteContent,
  getNoteResourceList
};
