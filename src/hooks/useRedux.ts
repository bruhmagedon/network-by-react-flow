import { useDispatch, useSelector } from 'react-redux';
import { StateSchema } from '@/app/store/StateSchema';
import { AppDispatch } from '@/app/store/store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<StateSchema>();
