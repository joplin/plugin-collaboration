import { Note, Resource } from 'utils/types';
import { ApiStatus } from './ApiStatus';

export interface AppState {
  isHost: boolean;
  hostJoined: boolean;
  username: string | null;
  apiStatus: ApiStatus | null;
  noteId: string | null;
  roomId: string | null;
  note: Note | null;
  resources: Resource[];
}
