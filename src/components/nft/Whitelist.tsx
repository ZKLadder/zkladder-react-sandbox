import React, { useEffect, useState } from 'react';
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
  const [roles, setRoles] = useState() as any;

  const [voucherData, setVoucherData] = useState({
    quantity: 1,
    userAddress: '',
    roleId: '',
    contractAddress: instance?.address,
  });

  useEffect(() => {
    async function getRoles() {
      const collectionMetadata = await instance?.getCollectionMetadata();
      setRoles(collectionMetadata?.roles);
      setVoucherData({ ...voucherData, roleId: collectionMetadata?.roles?.[0].id as string });
    }
    getRoles();
  }, []);

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

      <Form.Select
        style={{ width: '60%', marginTop: '15px', marginBottom: '15px' }}
        aria-label="Default select example"
        onChange={(event) => {
          setVoucherData({ ...voucherData, roleId: event.target.value });
        }}
      >
        {roles?.map((role:any) => (
          <option
            value={role.id}
            style={{ width: '60%', marginTop: '15px', marginBottom: '15px' }}
          >
            {role.name}

          </option>
        ))}
      </Form.Select>
      <br />
      <Button
        onClick={async () => {
          try {
            setError(false);
            setLoading(true);
            setConfirmed(false);

            const voucher = await instance?.signMintVoucher(voucherData.userAddress, voucherData.quantity, voucherData.roleId);

            await storeVoucher({
              contractAddress: instance?.address as string,
              userAddress: voucherData.userAddress,
              balance: voucher?.balance as number,
              roleId: voucherData.roleId,
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
