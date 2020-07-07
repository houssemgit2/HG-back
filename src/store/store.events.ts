import { EventEmitter } from 'events';
import { StrictEventEmitter } from 'nest-emitter';

interface AppEvents {
  storeCreated: (clusterId, storeId) => void;
}

export type MyEventEmitter = StrictEventEmitter<EventEmitter, AppEvents>;
