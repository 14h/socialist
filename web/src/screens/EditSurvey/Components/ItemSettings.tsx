import React from 'react';
import { Button, InputNumber, Typography } from 'antd';
import '../styles.less';
import { Item } from '../../../types';
import { EditOutlined } from '@ant-design/icons/lib';
import { ItemFormat } from './ItemFormat';



export const ItemSettings = ({ item, updateItem }: { item: Item; updateItem: (item: Item) => void; }) => {

    const renderOptions = () => {
        if (item.type === 'text') {
            const updateMinChars = (minCharacters: string | number | undefined) =>
                updateItem(Object.assign({}, item, { minCharacters }));
            const updateMaxChars = (maxCharacters: string | number | undefined) =>
                updateItem(Object.assign({}, item, { maxCharacters }));
            return (
                <>
                    <div className='option-item'>
                        <span>Min Characters:  </span>
                        <InputNumber defaultValue={ item?.minCharacters } onChange={ updateMinChars }/>
                    </div>
                    <div className='option-item'>
                        <span>Max Characters: </span>
                        <InputNumber defaultValue={ item?.maxCharacters } onChange={ updateMaxChars }/>
                    </div>
                </>
            );
        }

        if (item.type === 'number') {
            const updateMinValue = (minValue: string | number | undefined) =>
                updateItem(Object.assign({}, item, { minValue }));
            const updateMaxValue = (maxValue: string | number | undefined) =>
                updateItem(Object.assign({}, item, { maxValue }));

            return (
                <>
                    <div className='option-item'>
                        <span>Min Value:  </span>
                        <InputNumber defaultValue={ item?.minValue } onChange={ updateMinValue }/>
                    </div>
                    <div className='option-item'>
                        <span>Max Value: </span>
                        <InputNumber defaultValue={ item?.maxValue } onChange={ updateMaxValue }/>
                    </div>

                </>
            );
        }

        if (item.type === 'multi') {
            const updateMinOptions = (minOptions: string | number | undefined) =>
                updateItem(Object.assign({}, item, { minOptions }));
            const updateMaxOptions = (maxOptions: string | number | undefined) =>
                updateItem(Object.assign({}, item, { maxOptions }));

            return (

                <>
                    <div className='option-item'>
                        <span>Min Options:  </span>
                        <InputNumber defaultValue={ item?.minOptions } onChange={ updateMinOptions }/>
                    </div>
                    <div className='option-item'>
                        <span>Max Options: </span>
                        <InputNumber defaultValue={ item?.maxOptions } onChange={ updateMaxOptions }/>
                    </div>

                </>
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
    const onChangeType = (type: Item['type']) => updateItem({ type, name: item.name, description: item.description });

    return (
        <div className='item-block'>
            <div className='option-item'>
                <span>Question: </span>
                <span>{item.name}</span>
            </div>
            <div className='option-item'>
                <span>Type: </span>
                <ItemFormat callback={ onChangeType } className="edit-format">
                    { item.type }
                    <Button
                        type="link"
                    >
                        <EditOutlined/>
                    </Button>
                </ItemFormat>
            </div>
            { renderOptions() }
        </div>
    );

};
