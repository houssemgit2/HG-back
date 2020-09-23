import { EventEmitter } from 'events';
import { StrictEventEmitter } from 'nest-emitter';

interface StoreEvents {
  storeCreated: (clusterId, storeId: number) => void;
}
interface PromoEvents {
  promoCreated: (promoId: number) => void;
}

export type StoreEventEmitter = StrictEventEmitter<EventEmitter, StoreEvents>;
export type PromoEventEmitter = StrictEventEmitter<EventEmitter, PromoEvents>;
