import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

function CopyToClipboard({ text }:{text:string}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div>
      <Alert
        style={{ overflow: 'scroll' }}
      >
        {text}
      </Alert>
      <button
        type="button"
        onClick={copy}
      >
        {copied ? 'Copied!' : 'Copy to Clipboard'}
      </button>
    </div>
  );
}

export default CopyToClipboard;
