import React, { useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { walletState } from '../../state/wallet';
import { ipfsState, viewState } from '../../state/ipfs';
import Directories from './Directories';
import DirectoryExplorer from './DirectoryExplorer';

function Ipfs() {
  const { zkLadder } = useRecoilValue(walletState);
  const [ipfs, setIpfsState] = useRecoilState(ipfsState);
  const { view } = useRecoilValue(viewState);

  useEffect(() => {
    if (!ipfs.exists) {
      const ipfsInstance = zkLadder?.ipfs(
      process.env.REACT_APP_IPFS_ID as string,
      process.env.REACT_APP_IPFS_SECRET as string,
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
