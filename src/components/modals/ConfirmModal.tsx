export interface ConfirmModalProps<T> {
  open: boolean;
  isWarning?: boolean;
  isSuccess?: boolean;
  data?: T;
  headerText: string;
  bodyText: string;
  confirmBtnText?: string;
  cancelBtnText?: string;
  onConfirm: ((data: T) => void) | (() => void);
  onCancel?: () => void;
}

export function ConfirmModal<T = string>(props: ConfirmModalProps<T>) {
  const warningIcon = (
    <svg
      className="h-6 w-6 text-red-600"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  );

  const successIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 text-green-600"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  if (!props.open) {
    return <></>;
  }

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-[gray] bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg text-black bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white text-black px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  {props.isSuccess ? (
                    successIcon
                  ) : props.isWarning ? (
                    warningIcon
                  ) : (
                    <></>
                  )}
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-base font-semibold leading-6 text-gray-900"
                    id="modal-title"
                  >
                    {props.headerText || 'Are you sure?'}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {props.bodyText ||
                        'Click the confirm button to confirm this action.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`bg-[#a2988483] text-accent-dark px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6`}
            >
              <button
                type="button"
                onClick={() => {
                  if (props.data) {
                    return props.onConfirm(props.data);
                  } else {
                    (props.onConfirm as () => void)();
                  }
                }}
                // className="inline-flex w-full justify-center border-[lightgrey] border-2 rounded-md px-3 py-2 text-sm font-semibold bg-white shadow-sm sm:ml-3 sm:w-auto"
                className="inline-flex w-full justify-center border-accent-dark border-2 rounded-md px-3 py-2 text-sm font-semibold bg-accent-dark shadow-sm sm:ml-3 sm:w-auto text-white"
              >
                {props.confirmBtnText || 'Confirm'}
              </button>
              <button
                type="button"
                onClick={props.onCancel ? props.onCancel : () => {}}
                className="border-[lightgrey] border-2 mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm sm:mt-0 sm:w-auto"
              >
                {props.cancelBtnText || 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
