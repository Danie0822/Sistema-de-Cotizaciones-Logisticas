import Swal from 'sweetalert2';

export const showErrorAlert = (message = 'Ocurrió un error', title = 'Error') => {
  Swal.fire({
    icon: 'error',
    title,
    text: message,
    confirmButtonColor: '#222',
    confirmButtonText: 'OK',
    background: '#fff',
    color: '#222',
    iconColor: '#e53935',
    customClass: {
      popup: 'swal2-modern-popup',
      title: 'swal2-modern-title',
      confirmButton: 'swal2-modern-confirm',
    },
  });
};
