import React, { useEffect, useState } from 'react';

import './styles.less';
import { useFocus } from '@utils/hooks';


type TProps = {
    text?: string;
    placeholder: string;
    onUpdate: (newText?: string) => void;
};

export const EditableText = (props: TProps) => {
    const {text, placeholder, onUpdate} = props;

    const [ focusRef, isFocused ] = useFocus<HTMLInputElement>();

    useEffect(() => {
        if (!isFocused && newText !== text) {
            onUpdate(newText);
        }
    }, [isFocused]);

    const [ newText, setNewText ] = useState(text);

    const onKeyDown = (evt: any) => {
        if (evt.keyCode === 13 || evt.keyCode === 27) {
            focusRef?.current?.blur();
        }

        if (evt.keyCode === 13 && newText !== text) {
            onUpdate(newText);
        }

        if (evt.keyCode === 27) {
            setNewText(text);
        }
    };

    const handleClick = (e: any) => {
        if (focusRef?.current?.contains(e.target)) {

            return;
        }

        focusRef?.current?.blur();
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClick);

        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, []);

    return (
        <div className="editableTextWrapper">
            <input
                ref={ focusRef }
                alt={ placeholder }
                type="text"
                placeholder={ placeholder }
                value={ newText }
                spellCheck="false"
                autoComplete="false_does_not_work_but_this_does"
                onChange={ evt => setNewText(evt.target.value) }
                onKeyDown={ onKeyDown }
            />
        </div>
    );
};
