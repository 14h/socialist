import React from 'react';
import { Button, InputNumber, Typography } from 'antd';
import '../styles.css';
import { Item } from '../../../types';
import { EditOutlined } from '@ant-design/icons/lib';
import { ItemFormat } from './ItemFormat';
const { Text } = Typography;


export const ItemSettings = ({ item, updateItem }: { item: Item; updateItem: (item: Item) => void; }) => {

    const renderOptions = () => {
        if (item.type === 'text') {
            const updateMinChars = (minCharacters: number | undefined) =>
                updateItem(Object.assign({}, item, { minCharacters }));
            const updateMaxChars = (maxCharacters: number | undefined) =>
                updateItem(Object.assign({}, item, { maxCharacters }));
            return (
                <>
                    <div className='option-item'>
                        <span>Min Characters:  </span>
                        <InputNumber defaultValue={item?.minCharacters} onChange={updateMinChars}/>
                    </div>
                    <div className='option-item'>
                        <span>Max Characters: </span>
                        <InputNumber defaultValue={item?.minCharacters} onChange={updateMaxChars}/>
                    </div>
                </>
            );
        }

        if (item.type === 'number') {
            const updateMinValue = (minValue: number | undefined) =>
                updateItem(Object.assign({}, item, { minValue }));
            const updateMaxValue = (maxValue: number | undefined) =>
                updateItem(Object.assign({}, item, { maxValue }));

            return (
                <>
                    <div className='option-item'>
                        <span>Min Value:  </span>
                        <InputNumber defaultValue={item?.minValue} onChange={updateMinValue}/>
                    </div>
                    <div className='option-item'>
                        <span>Max Value: </span>
                        <InputNumber defaultValue={item?.maxValue} onChange={updateMaxValue}/>
                    </div>

                </>
            );
        }

        if (item.type === 'multi') {
            const updateMinOptions = (minOptions: number | undefined) =>
                updateItem(Object.assign({}, item, { minOptions }));
            const updateMaxOptions = (maxOptions: number | undefined) =>
                updateItem(Object.assign({}, item, { maxOptions }));

            return (

                <>
                    <div className='option-item'>
                        <span>Min Options:  </span>
                        <InputNumber defaultValue={item?.minOptions} onChange={updateMinOptions}/>
                    </div>
                    <div className='option-item'>
                        <span>Max Options: </span>
                        <InputNumber defaultValue={item?.maxOptions} onChange={updateMaxOptions}/>
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
    }
    const onChangeType = (type: Item['type']) => updateItem({ type, name: item.name, description: item.description });
    const updateName = (name: string) => updateItem(Object.assign({}, item, { name }));

    return (
        <div className='item-block'>
            <div className='option-item'>
                <span>Item name: </span>
                <Text editable={{ onChange: updateName }}>{item.name}</Text>
            </div>
            <div className='option-item'>
                <span>Item type: </span>
                <ItemFormat callback={onChangeType} className="edit-format">
                    <Button
                        type="link"
                    >
                        {item.type}
                        <EditOutlined/>
                    </Button>
                </ItemFormat>
            </div>
            {renderOptions()}
        </div>
    );

};
