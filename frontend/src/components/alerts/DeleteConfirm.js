import Swal from 'sweetalert2';

export const showDeleteConfirm = async (message = '¿Estás seguro de eliminar este registro?', title = 'Confirmar eliminación') => {
  const result = await Swal.fire({
    title,
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e53935',
    cancelButtonColor: '#222',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    background: '#fff',
    color: '#222',
    iconColor: '#fbc02d',
    customClass: {
      popup: 'swal2-modern-popup',
      title: 'swal2-modern-title',
      confirmButton: 'swal2-modern-confirm',
      cancelButton: 'swal2-modern-cancel',
    },
  });
  return result.isConfirmed;
};
