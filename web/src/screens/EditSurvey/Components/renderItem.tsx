import React from 'react';
import { Item, MultiItemOption } from '../../../types';

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
            console.log(item)
            return (
                <select
                    name={item.name}
                    onChange={console.log}
                >
                    {
                        (item?.options ?? [])?.map(
                            (option: MultiItemOption, i: number) =>
                                <option
                                    value={option.name}
                                    key={`${option.name}_${i}`}
                                >
                                    {option.description}
                                </option>
                        )
                    }
                </select>
            );
        default:
            return null;
    }
};
