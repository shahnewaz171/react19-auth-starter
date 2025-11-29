import React from 'react';
import Box from '@mui/material/Box';
import { KEYBOARD_KEY } from '@/utils/event';
import {
  getFilledArray,
  joinArrayStrings,
  mergeArrayStringFromIndex,
  updateIndex,
  split,
  mergeRefs
} from '@/components/form/helpers/otp';
import { useEvent } from '@/hooks/useEvent';
import TextFieldBox from '@/components/form/TextFieldBox';
import type { MuiOtpInputProps } from '@/components/types/index.types';
import cn from '@/utils/cn';

export type { MuiOtpInputProps };

type ValueSplitted = {
  character: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
}[];

const defaultValidateChar = () => true;

const OtpInput = (props: MuiOtpInputProps) => {
  const {
    value = '',
    length = 4,
    autoFocus = false,
    onChange,
    TextFieldsProps,
    onComplete,
    validateChar = defaultValidateChar,
    className,
    onBlur,
    ...restBoxProps
  } = props;

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const initialValue = React.useRef(value);

  const onCallbackEvent = useEvent(onComplete);

  const matchIsCompletedEvent = useEvent((filledStrings: string) => {
    const finalValue = filledStrings.slice(0, length);
    return {
      isCompleted: finalValue.length === length,
      finalValue
    };
  });

  React.useEffect(() => {
    const { isCompleted, finalValue } = matchIsCompletedEvent(initialValue.current);
    if (isCompleted) onCallbackEvent(finalValue);
  }, [length, onCallbackEvent, matchIsCompletedEvent]);

  const valueSplitted: ValueSplitted = getFilledArray(length, (_: unknown, index: number) => ({
    character: (value as string)[index] || '',
    inputRef: React.createRef<HTMLInputElement>()
  }));

  const getIndexByInputElement = (input: HTMLInputElement) =>
    valueSplitted.findIndex(({ inputRef }) => inputRef.current === input);

  const getCharactersSplitted = () => valueSplitted.map(({ character }) => character);

  const replaceCharOfValue = (charIndex: number, charValue: string) => {
    const newValueSplitted = updateIndex(getCharactersSplitted(), charIndex, charValue);
    return joinArrayStrings(newValueSplitted);
  };

  const focusInputByIndex = (index: number) => valueSplitted[index]?.inputRef.current?.focus();

  const selectInputByIndex = (index: number) => valueSplitted[index]?.inputRef.current?.select();

  const manageCaretForNextInput = (i: number) => {
    if (i + 1 === length) return;
    const next = valueSplitted[i + 1];

    if (next.character) {
      selectInputByIndex(i + 1);
    } else {
      focusInputByIndex(i + 1);
    }
  };

  const isCharValid = (char: string, index: number) => {
    if (typeof validateChar !== 'function') return true;
    return validateChar(char, index);
  };

  const handleOneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = getIndexByInputElement(e.target);

    // SMS autofill
    if (idx === 0 && e.target.value.length > 1) {
      const { finalValue, isCompleted } = matchIsCompletedEvent(e.target.value);

      onChange?.(finalValue);
      if (isCompleted) onComplete?.(finalValue);

      selectInputByIndex(finalValue.length - 1);
      return;
    }

    const initialChar = e.target.value[0] || '';
    let char = initialChar;

    if (char && !isCharValid(char, idx)) char = '';

    const newValue = replaceCharOfValue(idx, char);
    onChange?.(newValue);

    const { isCompleted, finalValue } = matchIsCompletedEvent(newValue);
    if (isCompleted) onComplete?.(finalValue);

    if (char !== '') {
      if (newValue.length - 1 < idx) {
        selectInputByIndex(newValue.length);
      } else {
        manageCaretForNextInput(idx);
      }
    } else if (initialChar === '') {
      if (newValue.length <= idx) selectInputByIndex(idx - 1);
    }
  };

  const handleOneInputKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = e.target as HTMLInputElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const idx = getIndexByInputElement(input);
    const caretAtStart = start === 0 && end === 0;

    if (input.value === e.key) {
      e.preventDefault();
      manageCaretForNextInput(idx);
      return;
    }

    if (e.key === KEYBOARD_KEY.backspace) {
      if (!input.value) {
        e.preventDefault();
        selectInputByIndex(idx - 1);
      } else if (caretAtStart) {
        e.preventDefault();
        const newValue = replaceCharOfValue(idx, '');
        onChange?.(newValue);

        if (newValue.length <= idx) selectInputByIndex(idx - 1);
      }
      return;
    }

    if (e.key === KEYBOARD_KEY.left) {
      e.preventDefault();
      selectInputByIndex(idx - 1);
      return;
    }

    if (e.key === KEYBOARD_KEY.right) {
      e.preventDefault();
      selectInputByIndex(idx + 1);
      return;
    }

    if (e.key === KEYBOARD_KEY.home) {
      e.preventDefault();
      selectInputByIndex(0);
      return;
    }

    if (e.key === KEYBOARD_KEY.end) {
      e.preventDefault();
      selectInputByIndex(valueSplitted.length - 1);
    }
  };

  const handleOneInputPaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const pasted = event.clipboardData.getData('text/plain');
    const input = event.target as HTMLInputElement;

    const idx = valueSplitted.findIndex(
      ({ character, inputRef }) => character === '' || inputRef.current === input
    );

    const chars = mergeArrayStringFromIndex(getCharactersSplitted(), split(pasted), idx).map(
      (c: string, i: number) => (isCharValid(c, i) ? c : '')
    );

    const newValue = joinArrayStrings(chars);
    onChange?.(newValue);

    const { isCompleted, finalValue } = matchIsCompletedEvent(newValue);

    if (isCompleted) {
      onComplete?.(finalValue);
      selectInputByIndex(length - 1);
    } else selectInputByIndex(newValue.length);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const stillInside = valueSplitted.some(({ inputRef }) => inputRef.current === e.relatedTarget);

    if (!stillInside) {
      const { isCompleted, finalValue } = matchIsCompletedEvent(value);
      onBlur?.(finalValue, isCompleted);
    }
  };

  return (
    <Box
      display="flex"
      gap="20px"
      alignItems="center"
      ref={containerRef}
      className={cn('gap-[13px] m-auto max-w-[430px]', className)}
      {...restBoxProps}
    >
      {valueSplitted.map(({ character, inputRef }, index) => {
        const {
          onPaste,
          onFocus,
          onKeyDown,
          className: textFieldClass,
          onBlur: textFieldBlur,
          inputRef: textFieldRef,
          ...restProps
        } = typeof TextFieldsProps === 'function'
          ? TextFieldsProps(index) || {}
          : TextFieldsProps || {};

        return (
          <TextFieldBox
            autoFocus={autoFocus && index === 0}
            inputRef={mergeRefs([inputRef, textFieldRef])}
            autoComplete="one-time-code"
            value={character}
            className={cn(
              'MuiOtpInput-TextField',
              `MuiOtpInput-TextField-${index + 1}`,
              textFieldClass
            )}
            onPaste={(e: React.ClipboardEvent<HTMLDivElement>) => {
              e.preventDefault();
              handleOneInputPaste(e);
              onPaste?.(e);
            }}
            onFocus={(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              e.preventDefault();
              e.target.select();
              onFocus?.(e);
            }}
            onChange={handleOneInputChange}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              handleOneInputKeyDown(e);
              onKeyDown?.(e);
            }}
            onBlur={(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              textFieldBlur?.(e);
              handleBlur(e);
            }}
            key={`otp-${index}`}
            {...restProps}
          />
        );
      })}
    </Box>
  );
};

export default OtpInput;
