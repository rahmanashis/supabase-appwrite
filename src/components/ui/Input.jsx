import './Input.css';

export function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  helper,
  required = false,
  className = '',
  ...rest
}) {
  return (
    <div className={`input-field ${className}`.trim()}>
      {label && (
        <label htmlFor={id} className="input-field__label">
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`input-field__input ${error ? 'input-field__input--error' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
        required={required}
        {...rest}
      />
      {helper && !error && (
        <span id={`${id}-helper`} className="input-field__helper">
          {helper}
        </span>
      )}
      {error && (
        <span id={`${id}-error`} className="input-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
