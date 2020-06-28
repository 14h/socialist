import { Item } from '../../../types';
import { renderItem } from './renderItem';
import React, { useContext } from 'react';
import ReactQuill from 'react-quill';
import { CoreCtx } from '../../../index';

type TProps = {
    item: Item;
};

export const SectionItem = (props: TProps) => {
    const {
        item,
    } = props;
    const [translations] = useContext(CoreCtx).translations;

    const currentLang = 'en';

    const translation = item?.description ? translations.get(item?.description) : {};
    const content = translation?.[currentLang];

    if (!item) {
        return null;
    }

    return (
        <div className="item-wrapper">
            <div
                key={item.name}
                className='item-preview'
            >
                <label htmlFor={item.name}>
                    <ReactQuill
                        value={content || ''}
                        readOnly={true}
                        theme={"bubble"}
                    />
                </label>
                {renderItem(item)}
            </div>

        </div>
    );
};
