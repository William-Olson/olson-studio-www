import { toast, ToastOptions } from 'react-toastify';

interface PendingToastArgs {
  pending: string;
  success: string;
  error: string;
}

const defaultToastOpts = {
  position: toast.POSITION.TOP_LEFT,
  autoClose: 7000
};

export const getToastTheme = (isDarkMode: boolean): 'dark' | 'colored' => {
  return isDarkMode ? 'dark' : 'colored';
};

export class Toast {
  public static showProgress(
    progressFn: () => Promise<void>,
    messageData: PendingToastArgs,
    opts?: ToastOptions
  ) {
    const fullOptions: ToastOptions = Object.assign(
      {},
      defaultToastOpts,
      opts || {}
    );
    toast.promise(progressFn, messageData, fullOptions);
  }

  public static show(message: string, opts?: ToastOptions) {
    const fullOptions: ToastOptions = Object.assign(
      {},
      defaultToastOpts,
      opts || {}
    );
    toast(message, fullOptions);
  }

  public static info(message: string, opts?: ToastOptions) {
    const fullOptions: ToastOptions = Object.assign(
      {},
      defaultToastOpts,
      opts || {},
      { type: 'info' }
    );
    toast(message, fullOptions);
  }

  public static success(message: string, opts?: ToastOptions) {
    const fullOptions: ToastOptions = Object.assign(
      {},
      defaultToastOpts,
      opts || {},
      { type: 'success' }
    );
    toast(message, fullOptions);
  }

  public static warning(message: string, opts?: ToastOptions) {
    const fullOptions: ToastOptions = Object.assign(
      {},
      defaultToastOpts,
      opts || {},
      { type: 'warning' }
    );
    toast(message, fullOptions);
  }

  public static error(message: string, opts?: ToastOptions) {
    const fullOptions: ToastOptions = Object.assign(
      {},
      defaultToastOpts,
      opts || {},
      { type: 'error' }
    );
    toast(message, fullOptions);
  }
}
