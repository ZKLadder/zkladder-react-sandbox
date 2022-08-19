import React, {
  useState, useEffect, useRef, ReactElement, cloneElement,
} from 'react';
import sharedStyle from '../../styles/shared.module.css';

function useComponentVisible(initialIsVisible:boolean) {
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
  const ref:any = useRef(null);

  const handleClickOutside = (event:any) => {
    if (ref.current && !ref?.current?.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return { ref, isComponentVisible, setIsComponentVisible };
}

// Lightweight component for building popover elements
function Popover({
  children, className, header, style,
}:{children?: any, header:ReactElement, className?:string, style?:any}) {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

  return (
    <div ref={ref} style={{ zIndex: '10', position: 'relative' }}>
      {cloneElement(header, {
        onClick: () => { setIsComponentVisible(!isComponentVisible); },
      })}
      <div data-testid="parent" style={style} className={`${className} ${isComponentVisible ? sharedStyle.options : sharedStyle['options-hidden']}`}>
        {children}
      </div>
    </div>
  );
}

Popover.defaultProps = {
  style: {},
  className: '',
  children: null,
};

export default Popover;
