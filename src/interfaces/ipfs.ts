import { Ipfs } from '@zkladder/zkladder-sdk-ts';

interface IpfsStateInterface {
  exists: boolean,
  instance?: Ipfs,
}

interface ViewStateInterface {
  view: 'directoryView' | 'cidView',
  cid: string,
  refreshCounter: number
}

interface FileUploadProps {
  createNewDirectory: boolean
}

export type { IpfsStateInterface, ViewStateInterface, FileUploadProps };
