import React from 'react';
import '../styles.less';
import { Item } from '../../../types';

// const itemDescription = {
//     'text': 'Users can enter a short phrase.',
//     'multi': 'Users can select one or more options.',
//     'rating': 'Users can answer with a 5 star rating scale (e.g. "Not interested" to "Very interested").',
//     'date': 'Users can select a specific date',
// };

type TProps = {
    callback: (selectedQuestion: Item['type']) => void;
}
export const AddItem = (props: TProps) => {
    const { callback } = props;

    return (
        <div className='add-item'>
            <div onClick={ () => callback('text') }>
                Text answer
            </div>
            <div onClick={ () => callback('multi') }>
                Multiple answers
            </div>
            <div onClick={ () => callback('rating') }>
                Rating scale
            </div>
            <div onClick={ () => callback('date') }>
                Date
            </div>
            <div onClick={ () => callback('number') }>
                Number
            </div>

        </div>
    );
};
