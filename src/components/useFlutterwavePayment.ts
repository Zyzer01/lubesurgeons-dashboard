// useFlutterwavePayment.js
import { useEffect } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

function useFlutterwavePayment(config: any) {
  const handleFlutterPayment = useFlutterwave(config);

  useEffect(() => {
    if (handleFlutterPayment) {
      handleFlutterPayment({
        callback: (response: any) => {
          console.log(response);
          closePaymentModal();
        },
        onClose: () => {},
      });
    }
  }, [handleFlutterPayment]);

  return handleFlutterPayment;
}

export default useFlutterwavePayment;
