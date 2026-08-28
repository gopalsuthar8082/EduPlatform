import React from 'react';
import {
  HiOutlineExclamationTriangle,
  HiOutlineInformationCircle,
  HiOutlineCheckCircle
} from 'react-icons/hi2';
import Modal from './Modal.jsx';
import Button from './Button.jsx';

/**
 * ConfirmDialog Component
 * Confirmation modal prompt for destructive actions, warnings, and alerts
 */
const ConfirmDialog = ({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone. Please confirm to proceed.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false
}) => {
  const iconConfig = {
    danger: {
      icon: HiOutlineExclamationTriangle,
      iconBg: 'bg-red-50 text-red-600',
      btnVariant: 'danger'
    },
    warning: {
      icon: HiOutlineExclamationTriangle,
      iconBg: 'bg-amber-50 text-amber-600',
      btnVariant: 'primary'
    },
    info: {
      icon: HiOutlineInformationCircle,
      iconBg: 'bg-blue-50 text-blue-600',
      btnVariant: 'primary'
    },
    success: {
      icon: HiOutlineCheckCircle,
      iconBg: 'bg-emerald-50 text-emerald-600',
      btnVariant: 'success'
    }
  };

  const currentConfig = iconConfig[variant] || iconConfig.danger;
  const IconComponent = currentConfig.icon;

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
  };

  const footer = (
    <div className="flex items-center justify-end gap-3 w-full">
      <Button
        variant="outline"
        size="md"
        onClick={onClose}
        disabled={loading}
      >
        {cancelText}
      </Button>
      <Button
        variant={currentConfig.btnVariant}
        size="md"
        onClick={handleConfirm}
        loading={loading}
      >
        {confirmText}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={!loading}
      footer={footer}
    >
      <div className="flex items-start gap-4">
        {/* Warning / Notice Icon */}
        <div className={`p-3 rounded-2xl flex-shrink-0 ${currentConfig.iconBg}`}>
          <IconComponent className="w-6 h-6" />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900 leading-snug">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
