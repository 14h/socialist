import React from 'react';
import { ImageOption, Item, TextOption } from '../../../types';

export const renderItem = (item: Item) => {

    switch (item.type) {
        case 'number':
            const min = item?.minValue ?? undefined;
            const max = item?.maxValue ?? undefined;
            return (
                <input
                    type='number'
                    id={item.name}
                    name={item.name}
                    min={min}
                    max={max}
                />
            );
        case 'text':
            const minCharacters = item?.minCharacters ?? undefined;
            const maxCharacters = item?.maxCharacters ?? undefined;
            return (
                <input
                    type='text'
                    name={item.name}
                    minLength={minCharacters}
                    maxLength={maxCharacters}
                />
            );
        case 'date':
            return null;
        case 'multi':
            return (
                <select
                    name={item.name}
                    onChange={console.log}
                >
                    {
                        item?.options?.map(
                            (option: ImageOption | TextOption, i: number) => {
                                switch(option.type) {
                                    case 'image':
                                        return <option
                                            value={option.name}
                                            key={`${option.name}_${i}`}
                                            style={{
                                                backgroundImage: option.url
                                            }}
                                        >
                                        </option>;
                                    case 'text':
                                        return <option
                                            value={option.name}
                                            key={`${option.name}_${i}`}
                                        >
                                            {option.description}
                                        </option>;
                                }
                            }
                        )
                    }
                </select>
            );
        default:
            return null;
    }
};
