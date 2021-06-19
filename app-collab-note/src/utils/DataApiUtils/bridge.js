import { FOUND, INVALID_TOKEN, SEARCHING, NOT_FOUND } from './clipperPortStatus';
import { config } from './config';

class Bridge {

  async init(authToken) {
    const initPort = config().startPort;

    this.clipperServerPortStatus_ = NOT_FOUND;
    this.clipperServerPort_ = null;
    this.authToken = () => authToken;

    await this.findClipperServerPort(initPort);

  }

  async findClipperServerPort(initPort) {
    let port = initPort;

    this.clipperServerPortStatus_ = SEARCHING;
    for (let i = 0; i < 10; i++) {
      try {
        let response = await fetch(`http://127.0.0.1:${port}/ping`);
        const text = await response.text();
        if (text.trim() === 'JoplinClipperServer') {
          this.clipperServerPortStatus_ = FOUND;
          this.clipperServerPort_ = port;

          const token = this.authToken();
          return this.clipperApiExec('GET', 'notes', { token })
            .catch(() => {
              this.clipperServerPortStatus_ = INVALID_TOKEN;
              throw new Error('Invalid Token');
            });
        }
      } catch (error) {
        console.log(error.message);
      }

      port += 1;
    }

    this.clipperServerPortStatus_ = NOT_FOUND;
    throw new Error('Clipper Server not found!');
  }

  get clipperServerPortStatus() {
    return this.clipperServerPortStatus_ || NOT_FOUND;
  }

  clipperServerBaseUrl() {
    if (!this.clipperServerPort_ || this.clipperServerPortStatus_ !== FOUND) return;
    return `http://127.0.0.1:${this.clipperServerPort_}`;
  }

  async clipperApiExec(method, path, query, body) {
    if (!this.clipperServerPort_ || this.clipperServerPortStatus_ !== FOUND) throw new Error('Clipper Server not found!');

    const baseUrl = this.clipperServerBaseUrl();

    if (!baseUrl) throw new Error('Missing Data API URL!!');

    const fetchOptions = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);

    query.token = this.authToken();

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

    const json = await response.json();
    return json;
  }

  async updateNoteContent(note) {
    const { id, body } = note;
    if (!id) throw new Error('Cannot update a note without id');
    return this.clipperApiExec('PUT', `notes/${id}`, {}, { body });
  }

  async getNote(id, fields = []) {
    if (!id) throw new Error('Cannot get a note without id');
    return this.clipperApiExec('GET', `notes/${id}`, { fields: fields.join(',') });
  }
}

const bridge_ = new Bridge();

const bridge = function () {
  return bridge_;
};

export { bridge };
