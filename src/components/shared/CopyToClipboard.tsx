import React, { useState } from 'react';
import { Clipboard, ClipboardCheck } from 'react-bootstrap-icons';
import style from '../../styles/shared.module.css';

function CopyToClipboard({ text, className }:{text:string, className?:string}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <span className={className}>
      {text}
      {copied ? (
        <ClipboardCheck
          className={style['copy-icon']}
          size={14}
        />
      ) : (
        <Clipboard
          onClick={copy}
          className={style['copy-icon']}
          size={14}
        />
      )}
    </span>
  );
}

CopyToClipboard.defaultProps = {
  className: '',
};

export default CopyToClipboard;
