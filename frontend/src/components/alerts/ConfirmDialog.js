import Swal from 'sweetalert2';

/**
 * Componente de confirmación reutilizable para cerrar sesión u otras acciones peligrosas.
 * @param {Object} props
 * @param {Function} props.onConfirm - Acción a ejecutar si el usuario confirma.
 * @param {string} [props.title] - Título del modal.
 * @param {string} [props.text] - Texto del modal.
 * @param {string} [props.confirmText] - Texto del botón de confirmación.
 * @param {string} [props.cancelText] - Texto del botón de cancelar.
 * @param {string} [props.icon] - Icono de SweetAlert.
 */
export default function ConfirmDialog({
  onConfirm,
  title = '¿Cerrar sesión?',
  text = '¿Estás seguro que deseas salir?',
  confirmText = 'Sí, salir',
  cancelText = 'Cancelar',
  icon = 'warning',
}) {
  const show = async () => {
    const result = await Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      onConfirm();
    }
  };
  return show;
}
