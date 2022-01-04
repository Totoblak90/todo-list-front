import Swal from 'sweetalert2';

export function noConectionAlert(): void {
  Swal.fire(
    'Error',
    'We had an unexpected problem. Please check your connection or try again later',
    'error'
  );
}
