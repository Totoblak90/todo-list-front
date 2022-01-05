import Swal from 'sweetalert2';

export function noConectionAlert(): void {
  Swal.fire(
    'Error',
    'We had an unexpected problem. Please check your connection or try again later',
    'error'
  );
}

export function wrongCredentialsAlert(): void {
  Swal.fire(
    'Error',
    'Wrong credentials, please verify the information provided',
    'warning'
  )
}

export function unknownErrorAlert(): void {
  Swal.fire(
    'Error',
    'We are sorry. We had an unexpected problem, please try again',
    'error'
  )
}
