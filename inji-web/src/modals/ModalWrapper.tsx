import React,{useEffect} from 'react';
import {ModalWrapperProps} from "../types/components";
export const ModalWrapper: React.FC<ModalWrapperProps> = (props) => {

    // Effect to lock/unlock scroll on body when modal is open/closed
    useEffect(() => {
      // Lock scrolling when the modal is open
      document.body.style.overflow = 'hidden';
  
      // Cleanup: Unlock scrolling when the modal is closed
      return () => {
        document.body.style.overflow = '';
      };
    }, []); // Empty dependency array ensures this runs on mount/unmount only

  return <>
   <div data-testid="ModalWrapper-Outer-Container" className={`fixed inset-0 ${props.zIndex == 50 ? 'z-50' : 'z-40'} overflow-y-auto overflow-x-hidden`}>
      <div className="min-h-full p-0 flex items-center justify-center">
        <div className={`w-auto my-8 mx-4 sm:mx-6 ${props.size === '3xl' ? 'max-w-3xl' : 'max-w-sm'} min-w-[320px]`}>
          <div data-testid="ModalWrapper-Inner-Container" className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-iw-background outline-none focus:outline-none">
            {props.header}
            {props.content}
            {props.footer}
          </div>
        </div>
      </div>
    </div>

    <div data-testid="ModalWrapper-BackDrop" className={`opacity-25 fixed inset-0 ${props.zIndex == 50 ? 'z-40' : 'z-30'} bg-iw-backDrop`}></div>
  </>;
};