import { counterActions } from '@/features/counter/counterSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';

export function Counter() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <div>
        <button aria-label='Increment value' onClick={() => dispatch(counterActions.increment())}>
          Increment
        </button>
        <span>{count}</span>
        <button aria-label='Decrement value' onClick={() => dispatch(counterActions.decrement())}>
          Decrement
        </button>
      </div>
    </div>
  );
}
