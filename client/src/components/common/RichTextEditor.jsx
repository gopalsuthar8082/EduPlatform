import React, { useState, useRef } from 'react';
import {
  HiOutlineBold,
  HiOutlineItalic,
  HiOutlineCodeBracket,
  HiOutlineLink,
  HiOutlineListBullet,
  HiOutlineNumberedList,
  HiOutlineH1,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineEye,
  HiOutlinePencilSquare
} from 'react-icons/hi2';

/**
 * RichTextEditor Component
 * Markdown / formatted text editor with formatting toolbar and preview toggle
 */
const RichTextEditor = ({
  value = '',
  onChange,
  placeholder = 'Write content here...',
  minHeight = '180px',
  label,
  error,
  disabled = false,
  className = ''
}) => {
  const [activeMode, setActiveMode] = useState('edit'); // 'edit' | 'preview'
  const textareaRef = useRef(null);

  const applyFormat = (prefix, suffix = '', defaultPlaceholder = '') => {
    if (disabled || !textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultPlaceholder;

    const before = value.substring(0, start);
    const after = value.substring(end);

    const replacement = `${prefix}${selectedText}${suffix}`;
    const newValue = `${before}${replacement}${after}`;

    if (onChange) {
      onChange(newValue);
    }

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 0);
  };

  const handleBold = () => applyFormat('**', '**', 'bold text');
  const handleItalic = () => applyFormat('*', '*', 'italic text');
  const handleCode = () => applyFormat('`', '`', 'code');
  const handleHeading = () => applyFormat('### ', '', 'Heading');
  const handleLink = () => applyFormat('[', '](https://example.com)', 'link text');
  const handleBulletList = () => applyFormat('- ', '', 'List item');
  const handleNumberedList = () => applyFormat('1. ', '', 'Numbered item');
  const handleQuote = () => applyFormat('> ', '', 'Quote');

  // Simple basic renderer for preview mode
  const renderPreview = (text) => {
    if (!text) {
      return <p className="text-gray-400 italic">Nothing to preview</p>;
    }

    // Convert basic markdown tags to styled JSX elements
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-base font-bold text-gray-900 mt-2 mb-1">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-lg font-bold text-gray-900 mt-3 mb-1">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h1 key={idx} className="text-xl font-bold text-gray-900 mt-4 mb-2">
            {line.replace('# ', '')}
          </h1>
        );
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote
            key={idx}
            className="border-l-4 border-indigo-500 pl-3 my-2 text-gray-600 italic bg-gray-50 py-1 rounded-r"
          >
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-gray-700">
            {line.replace('- ', '')}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-gray-700">
            {line.replace(/^\d+\.\s/, '')}
          </li>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="text-gray-700 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Optional Label */}
      {label && (
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          {label}
        </label>
      )}

      {/* Editor Box */}
      <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-2xs focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
        {/* Toolbar Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200 gap-2 flex-wrap">
          {/* Formatting Buttons */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={handleBold}
              disabled={disabled || activeMode === 'preview'}
              title="Bold"
              className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200/70 disabled:opacity-40 transition-colors focus:outline-none"
            >
              <HiOutlineBold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleItalic}
              disabled={disabled || activeMode === 'preview'}
              title="Italic"
              className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200/70 disabled:opacity-40 transition-colors focus:outline-none"
            >
              <HiOutlineItalic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleHeading}
              disabled={disabled || activeMode === 'preview'}
              title="Heading"
              className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200/70 disabled:opacity-40 transition-colors focus:outline-none"
            >
              <HiOutlineH1 className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-300 mx-1" />
            <button
              type="button"
              onClick={handleCode}
              disabled={disabled || activeMode === 'preview'}
              title="Inline Code"
              className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200/70 disabled:opacity-40 transition-colors focus:outline-none"
            >
              <HiOutlineCodeBracket className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleLink}
              disabled={disabled || activeMode === 'preview'}
              title="Insert Link"
              className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200/70 disabled:opacity-40 transition-colors focus:outline-none"
            >
              <HiOutlineLink className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleBulletList}
              disabled={disabled || activeMode === 'preview'}
              title="Bullet List"
              className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200/70 disabled:opacity-40 transition-colors focus:outline-none"
            >
              <HiOutlineListBullet className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNumberedList}
              disabled={disabled || activeMode === 'preview'}
              title="Numbered List"
              className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200/70 disabled:opacity-40 transition-colors focus:outline-none"
            >
              <HiOutlineNumberedList className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleQuote}
              disabled={disabled || activeMode === 'preview'}
              title="Quote"
              className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200/70 disabled:opacity-40 transition-colors focus:outline-none"
            >
              <HiOutlineChatBubbleBottomCenterText className="w-4 h-4" />
            </button>
          </div>

          {/* Edit / Preview Mode Switch */}
          <div className="flex items-center bg-gray-200/70 p-0.5 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveMode('edit')}
              className={`
                px-2.5 py-1 rounded-md flex items-center gap-1 transition-all
                ${activeMode === 'edit' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-gray-600 hover:text-gray-900'}
              `}
            >
              <HiOutlinePencilSquare className="w-3.5 h-3.5" />
              <span>Write</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('preview')}
              className={`
                px-2.5 py-1 rounded-md flex items-center gap-1 transition-all
                ${activeMode === 'preview' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-gray-600 hover:text-gray-900'}
              `}
            >
              <HiOutlineEye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>
        </div>

        {/* Editor Body */}
        {activeMode === 'edit' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            style={{ minHeight }}
            className="w-full p-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none resize-y font-sans leading-relaxed disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
        ) : (
          <div
            style={{ minHeight }}
            className="w-full p-4 text-sm bg-gray-50/50 overflow-y-auto prose prose-sm max-w-none"
          >
            {renderPreview(value)}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1.5 text-xs text-red-600 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

export default RichTextEditor;
