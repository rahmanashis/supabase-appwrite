import './Select.css';

export function Select({
  id,
  label,
  value,
  onChange,
  onBlur,
  options,
  error,
  helper,
  required = false,
  className = '',
  ...rest
}) {
  return (
    <div className={`select-field ${className}`.trim()}>
      {label && (
        <label htmlFor={id} className="select-field__label">
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`select-field__select ${error ? 'select-field__select--error' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helper ? `${id}-helper` : undefined}
        required={required}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helper && !error && (
        <span id={`${id}-helper`} className="select-field__helper">
          {helper}
        </span>
      )}
      {error && (
        <span id={`${id}-error`} className="select-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
