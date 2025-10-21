import Swal from 'sweetalert2';

export const showSuccessAlert = (message = 'Operación exitosa', title = 'Éxito') => {
  Swal.fire({
    icon: 'success',
    title,
    text: message,
    confirmButtonColor: '#222',
    confirmButtonText: 'OK',
    background: '#fff',
    color: '#222',
    iconColor: '#4caf50',
    customClass: {
      popup: 'swal2-modern-popup',
      title: 'swal2-modern-title',
      confirmButton: 'swal2-modern-confirm',
    },
  });
};
