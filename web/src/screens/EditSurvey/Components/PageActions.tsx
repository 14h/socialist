import React from 'react';
import '../styles.css';
import { SortModal } from './SortModal';
import { Item, Page } from '../../../types';
import { LogicModal } from './LogicModal';

type TProps = {
    page: Page;
    updatePage: (newPage: Page) => any;
}

export const PageActions = (props: TProps) => {
    const {page, updatePage} = props;
    return (
        <div className="survey-actions">
            <SortModal
                items={ page.items }
                updateItems={ (items: Item[]) => updatePage({...page, items})}
            />
            <LogicModal
                page={page}
                setPage={updatePage}
            />
        </div>
    );
}
