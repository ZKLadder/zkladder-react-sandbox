import { atom } from 'recoil';
import { Post } from '../interfaces/cms';

const postsState = atom({
  key: 'cmsPosts',
  default: { posts: []as Post[], loaded: false, error: '' },
});

export { postsState };
