import { useMemo, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { EditorView } from '@codemirror/view';

import FieldWrapper, { type Props as WrapperProps } from './FieldWrapper';
import { cn } from './../utilities';

export type CodeBlockProps = {
  language: 'javascript' | 'python';
  initialCode: string;
  onChange: (value: string) => void;
  onPaste?: () => void;
} & Omit<WrapperProps, 'children' | 'inline'>;

function getLanguageExtension(lang: string) {
  switch (lang) {
    case 'javascript':
    case 'js':
    case 'typescript':
    case 'ts':
      return javascript({ typescript: lang === 'typescript' || lang === 'ts' });
    case 'python':
    case 'py':
      return python();
    default:
      return [];
  }
}

const CodeBlock = ({
  language,
  initialCode,
  onChange,
  readOnly = false,
  className,
  onPaste,
  error,
  ...wrapperProps
}: CodeBlockProps) => {
  const [code, setCode] = useState(initialCode);

  const extensions = useMemo(() => {
    return [getLanguageExtension(language), EditorView.lineWrapping];
  }, [language]);

  return (
    <FieldWrapper readOnly={readOnly} error={error} {...wrapperProps}>
      <div
        onPaste={onPaste}
        className={cn(
          'w-full rounded-mds-4 border border-interface-subtle',
          readOnly ? 'bg-interface-disabled' : 'bg-interface',
          className,
          error
            ? 'border-danger-subtle bg-danger-subtle text-on-danger-subtle'
            : 'focus:border-selected'
        )}
      >
        <CodeMirror
          value={code}
          height="14rem"
          theme={oneDark}
          editable={!readOnly}
          extensions={extensions}
          basicSetup={{ lineNumbers: true }}
          onChange={(value) => {
            setCode(value);
            if (typeof onChange === 'function') onChange(value);
          }}
        />
      </div>
    </FieldWrapper>
  );
};

export default CodeBlock;
