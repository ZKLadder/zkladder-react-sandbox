import React, { useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { Ipfs as IpfsService } from '@zkladder/zkladder-sdk-ts';
import { ipfsState, viewState } from '../../state/ipfs';
import Directories from './Directories';
import DirectoryExplorer from './DirectoryExplorer';
import config from '../../config';

function Ipfs() {
  const [ipfs, setIpfsState] = useRecoilState(ipfsState);
  const { view } = useRecoilValue(viewState);

  useEffect(() => {
    if (!ipfs.exists) {
      const ipfsInstance = new IpfsService(
      config.ipfs.projectId as string,
      config.ipfs.projectSecret as string,
      );
      setIpfsState({ instance: ipfsInstance, exists: true });
    }
  }, []);

  return (
    <div>
      {view === 'directoryView'
        ? <Directories />
        : <DirectoryExplorer />}
    </div>
  );
}

export default Ipfs;
