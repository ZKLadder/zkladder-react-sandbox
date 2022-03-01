import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Form, Button } from 'react-bootstrap';
import { nftState } from '../../state/nftContract';
import { walletState } from '../../state/wallet';
import { storeVoucher } from '../../utils/api';
import Error from '../shared/Error';
import Loading from '../shared/Loading';

function Whitelist() {
  const { instance } = useRecoilValue(nftState);
  const { chainId } = useRecoilValue(walletState);

  const [error, setError] = useState() as any;
  const [loading, setLoading] = useState() as any;
  const [confirmed, setConfirmed] = useState() as any;

  const [voucherData, setVoucherData] = useState({
    quantity: 1,
    userAddress: '',
    contractAddress: instance?.address,
  });

  return (
    <div>
      <Form.Label>Create New Whitelist Voucher</Form.Label>
      <Form.Control
        data-testid="tokenQueryForm"
        onChange={(event) => { setVoucherData({ ...voucherData, userAddress: event.target.value }); }}
        type="text"
        style={{ width: '60%' }}
        placeholder="Enter a User Address"
      />
      <Form.Control
        value={voucherData.quantity}
        data-testid="tokenQueryForm"
        onChange={(event) => { setVoucherData({ ...voucherData, quantity: parseInt(event.target.value, 10) }); }}
        type="text"
        style={{ width: '60%', marginTop: '15px', marginBottom: '15px' }}
        placeholder="Enter a quantity"
      />

      <Button
        onClick={async () => {
          try {
            setError(false);
            setLoading(true);
            setConfirmed(false);
            const voucher = await instance?.signMintVoucher(voucherData.userAddress, voucherData.quantity);

            await storeVoucher({
              contractAddress: instance?.address as string,
              userAddress: voucherData.userAddress,
              balance: voucher?.balance as number,
              chainId: chainId?.toString() as string,
              signedVoucher: voucher as any,
            });
            setConfirmed(true);
          } catch (err:any) {
            setLoading(false);
            setError(err.message);
          }
        }}
      >
        Create and Store Voucher
      </Button>

      {error ? (<Error text={error} />) : null}
      {loading ? (<Loading />) : null}
      {confirmed ? (<p> Voucher Generated! </p>) : null}
    </div>
  );
}

export default Whitelist;
