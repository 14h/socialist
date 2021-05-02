import React from 'react';

import './styles.less';
import { Link } from 'react-router-dom';
import { SurveyStore } from '@utils/hooks';
import { EditableText } from '@components/EditableText';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

import arrayMove from 'array-move';
import { EditOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';

type TProps = {
    surveyStore: SurveyStore;
    userToken: string;
    orgName: string;
}

export const SurveySectionList = (props: TProps) => {
    const {
        surveyStore,
        orgName,
    } = props;

    const survey = surveyStore.value;

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        surveyStore.setValue({
            ...survey,
            sections: arrayMove(survey.sections, result.source.index, result.destination.index),
        });
    };


    if (survey.sections.length === 0) {
        return (
            <>
                Click on the plus button to create your first Section!
            </>
        );
    }

    return (
        <div className="table">
            <PlusOutlined />
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {survey.sections.map((section, index) => (
                                <Draggable key={index} draggableId={`section-${index}`} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}

                                            style={ {
                                                ...provided.draggableProps.style
                                            }}
                                        >
                                            <div className="survey-section">
                                                <div className="section-options">

                                                    <Link to={ `/${ orgName }/surveys/${survey.id}/section/${ index }` }>
                                                        <EditOutlined
                                                            // style={{
                                                            //     fontSize: '24px',
                                                            // }}
                                                        />
                                                    </Link>
                                                    <MenuOutlined
                                                        // style={{
                                                        //     fontSize: '24px',
                                                        // }}
                                                        {...provided.dragHandleProps}
                                                    />
                                                </div>
                                                <EditableText
                                                    text={ section.name }
                                                    placeholder="Name this section!"
                                                    onUpdate={ name => surveyStore.updateSection({...section, name: name ?? 'Untitled section'}) }
                                                />
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};
