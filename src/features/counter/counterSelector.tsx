import { StateSchema } from '@/app/store/StateSchema';

export const selectCount = (state: StateSchema) => state.counter.value;
