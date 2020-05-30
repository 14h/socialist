import React from 'react';
import { InputNumber } from 'antd';
import './styles.css';
import { Item } from '../../types';


export const ItemOptions = ({ item, updateItem }: { item: Item; updateItem: (item: Item) => void; }) => {
    if (item.type === 'page') {
        return (
            <div/>
        );
    }

    if (item.type === 'text') {
        const updateMinChars = (minCharacters: number | undefined) =>
            updateItem(Object.assign({}, item, { minCharacters }));
        const updateMaxChars = (maxCharacters: number | undefined) =>
            updateItem(Object.assign({}, item, { maxCharacters }));
        return (
            <div className='item-block'>
                <span>Question options:</span>
                <div className='option-item'>
                    <span>Min Characters:  </span>
                    <InputNumber defaultValue={item?.minCharacters} onChange={updateMinChars}/>
                </div>
                <div className='option-item'>
                    <span>Max Characters: </span>
                    <InputNumber defaultValue={item?.minCharacters} onChange={updateMaxChars}/>
                </div>

            </div>
        );
    }

    if (item.type === 'number') {
        const updateMinValue = (minValue: number | undefined) =>
            updateItem(Object.assign({}, item, { minValue }));
        const updateMaxValue = (maxValue: number | undefined) =>
            updateItem(Object.assign({}, item, { maxValue }));

        return (
            <div className='item-block'>
                <span>Question options:</span>
                <div className='option-item'>
                    <span>Min Value:  </span>
                    <InputNumber defaultValue={item?.minValue} onChange={updateMinValue}/>
                </div>
                <div className='option-item'>
                    <span>Max Value: </span>
                    <InputNumber defaultValue={item?.maxValue} onChange={updateMaxValue}/>
                </div>

            </div>
        );
    }

    if (item.type === 'multi') {
        const updateMinOptions = (minOptions: number | undefined) =>
            updateItem(Object.assign({}, item, { minOptions }));
        const updateMaxOptions = (maxOptions: number | undefined) =>
            updateItem(Object.assign({}, item, { maxOptions }));

        return (

            <div className='item-block'>
                <span>Question options:</span>
                <div className='option-item'>
                    <span>Min Options:  </span>
                    <InputNumber defaultValue={item?.minOptions} onChange={updateMinOptions}/>
                </div>
                <div className='option-item'>
                    <span>Max Options: </span>
                    <InputNumber defaultValue={item?.maxOptions} onChange={updateMaxOptions}/>
                </div>

            </div>
        );
    }

    if (item.type === 'date') {
        return (
            <div/>
        );
    }

    return (
        <div/>
    );
};
