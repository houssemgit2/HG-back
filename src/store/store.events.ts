import { EventEmitter } from 'events';
import { StrictEventEmitter } from 'nest-emitter';
import { Store } from 'src/entities/Store';

interface AppEvents {
  storeCreated: (clusterId, storeId) => void;
}

export type MyEventEmitter = StrictEventEmitter<EventEmitter, AppEvents>;
