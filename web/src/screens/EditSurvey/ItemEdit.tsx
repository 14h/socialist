import React from 'react';
import { Select } from 'antd';
import './styles.css';
import { translations } from './types';


export const ItemEdit = ({ item, updateItem, currentLang }: any) => {
    if (item.type === 'multi') {
        return (
            <div>
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Please select"
                    defaultValue={[]}
                    onChange={console.log}
                >
                    {
                        translations.map((
                            t: any,
                            index: number,
                        ) => (
                            <Select.Option key={t.key} value={t.key}>
                                {t[currentLang]}
                            </Select.Option>
                        ))
                    }
                </Select>
            </div>
        );
    }

    return null;
};
