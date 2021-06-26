import { MessageType } from './MessageType';

export interface ApiStatus {
  messageType: MessageType;
  message: string;
  status?: string;
}
