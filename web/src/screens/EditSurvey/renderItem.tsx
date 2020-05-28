import React from 'react';
import { ImageOption, TextOption } from '../../types';

export const renderItem = (item: any) => {

    switch (item.type) {
        case 'number':
            const min = item?.minValue ?? undefined;
            const max = item?.maxValue ?? undefined;
            return <div
                key={item.name}
                className='item'
            >
                <label htmlFor={item.name}>
                    <h2>
                        {item.title}
                    </h2>
                </label>
                <input
                    type='number'
                    id={item.name}
                    name={item.name}
                    min={min}
                    max={max}
                />
                <div className="requirements">
                    Must be a between {min} and {max}.
                </div>
            </div>;
        case 'text':
            const minCharacters = item?.minCharacters ?? undefined;
            const maxCharacters = item?.maxCharacters ?? undefined;
            return <div
                key={item.name}
                className='item'
            >
                <label htmlFor={item.name}>
                    <h2>
                        {item.title}
                    </h2>
                </label>
                <input
                    type='text'
                    name={item.name}
                    minLength={minCharacters}
                    maxLength={maxCharacters}
                />
            </div>;
        case 'date':
            return <div
                key={item.name}
                className='item'
            >
                <label htmlFor={item.name}>
                    <h2>
                        {item.title}
                    </h2>
                </label>
            </div>;
        case 'multi':
            return <div
                key={item.name}
                className='item'
            >
                <label htmlFor={item.name}>
                    <h2>
                        {item.title}
                    </h2>
                </label>
                <select
                    name={item.name}
                    onChange={console.log}
                >
                    {
                        item.options.map(
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
                                            {option.title}
                                        </option>;
                                }
                            }
                        )
                    }
                </select>
            </div>;
        default:
            return null;
    }
};
