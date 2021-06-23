export interface Note {
    id?: string;
    title: string;
    body: string;
}

export interface Resource {
  id: string;
  title: string;
  blob: Blob | null;
}