import React from 'react';
import '../styles.css';
import { SortModal } from './SortModal';
import { Item, Section } from '../../../types';
import { LogicModal } from './LogicModal';

type TProps = {
    section: Section;
    updateSection: (section: Section) => any;
}

export const SectionActions = (props: TProps) => {
    const {section, updateSection} = props;
    return (
        <div className="survey-actions">
            <SortModal
                items={ section.items }
                updateItems={ (items: Item[]) => updateSection({...section, items})}
            />
            <LogicModal
                page={section}
                setPage={updateSection}
            />
        </div>
    );
}
