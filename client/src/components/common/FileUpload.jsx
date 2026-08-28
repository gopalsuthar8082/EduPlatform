import React, { useState, useRef } from 'react';
import {
  HiOutlineArrowUpTray,
  HiOutlineDocumentText,
  HiOutlinePhoto,
  HiOutlineTrash,
  HiOutlineExclamationCircle
} from 'react-icons/hi2';

/**
 * FileUpload Component
 * Drag and drop file upload zone with file preview, validation, and removal
 */
const FileUpload = ({
  onFileSelect,
  accept = '.pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png',
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10 MB default
  label = 'Upload File',
  description = 'PDF, DOC, PPT or Images up to 10MB',
  disabled = false,
  className = ''
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateAndProcessFiles = (fileList) => {
    setErrorMessage('');
    const validFiles = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      // Check max size
      if (maxSize && file.size > maxSize) {
        setErrorMessage(`File "${file.name}" exceeds the maximum size limit (${formatFileSize(maxSize)}).`);
        return;
      }

      validFiles.push(file);
    }

    const updatedFiles = multiple ? [...selectedFiles, ...validFiles] : validFiles;
    setSelectedFiles(updatedFiles);

    if (onFileSelect) {
      onFileSelect(multiple ? updatedFiles : updatedFiles[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFiles(e.target.files);
    }
  };

  const handleRemoveFile = (indexToRemove, e) => {
    e.stopPropagation();
    const updated = selectedFiles.filter((_, idx) => idx !== indexToRemove);
    setSelectedFiles(updated);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onFileSelect) {
      onFileSelect(multiple ? updated : null);
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
      return HiOutlinePhoto;
    }
    return HiOutlineDocumentText;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Drag & Drop Area */}
      <div
        onClick={() => !disabled && fileInputRef.current && fileInputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer select-none
          flex flex-col items-center justify-center
          ${
            disabled
              ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
              : isDragOver
              ? 'border-indigo-600 bg-indigo-50/50 scale-[1.01]'
              : 'border-gray-300 bg-white hover:border-indigo-400 hover:bg-gray-50/50'
          }
        `}
      >
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 shadow-2xs">
          <HiOutlineArrowUpTray className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-gray-800">
          <span className="text-indigo-600 hover:underline">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {label ? `${label} — ` : ''}{description}
        </p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 font-medium">
          <HiOutlineExclamationCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Selected Files List Preview */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedFiles.map((file, idx) => {
            const FileIcon = getFileIcon(file.name);
            return (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-gray-100 text-gray-600 flex-shrink-0">
                    <FileIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate max-w-xs sm:max-w-md">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleRemoveFile(idx, e)}
                  title="Remove file"
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
