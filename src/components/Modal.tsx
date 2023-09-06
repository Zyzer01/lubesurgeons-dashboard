import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

interface MyModalProps {
  isOpen: boolean; // Add isOpen prop to determine modal visibility
  closeModal: () => void;
  actionText: string;
  actionSub: string;
  onActionClick: () => void; // Add onActionClick prop
  buttonColor: string; // Add buttonColor prop
}

export default function MyModal({
  isOpen,
  closeModal,
  actionText,
  onActionClick,
  buttonColor,
  actionSub,
}: MyModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 overflow-y-auto z-50" onClose={closeModal}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
          </Transition.Child>

          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-black"
              >
                {actionText}
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-md text-gray-500">
                  {actionSub}
                </p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className={`inline-flex justify-center rounded-md border border-transparent ${buttonColor} px-4 py-2 text-sm font-medium text-white hover:bg-opacity-75 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75`}
                  onClick={onActionClick}
                >
                  {actionText}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
