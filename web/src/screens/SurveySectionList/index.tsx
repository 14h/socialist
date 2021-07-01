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

    const addSection = (index: number) => {
        surveyStore.insertSection(
            {
                name: 'Name this section',
                description: '',
                items: [],
                conditions: [],
            },
            index,
        )
    }


    return (
        <>
            <div
                onClick={ () => addSection(0) }
                style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    margin: '0 auto',
                    backgroundColor: '#777',
                    padding: '12px',
                    textAlign: 'center',
                }}
            >
                <PlusOutlined/>
            </div>
            {survey.sections.map((section, index) => (
                <div>
                    <div className="survey-section">
                        <div className="section-options">

                            <Link to={ `/${ orgName }/surveys/${survey.id}/section/${ index }` }>
                                <EditOutlined/>
                            </Link>
                        </div>
                        <EditableText
                            text={ section.name }
                            placeholder="Name this section!"
                            onUpdate={ name => surveyStore.updateSection({...section, name: name ?? 'Untitled section'}, index) }
                        />
                    </div>
                    <div
                        onClick={ () => addSection(index + 1) }
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            margin: '0 auto',
                            backgroundColor: '#777',
                            padding: '12px',
                            textAlign: 'center',
                        }}
                    >
                        <PlusOutlined/>
                    </div>
                </div>
            ))}
        </>
    );
}

export const DraggableSurveySectionList = (props: TProps) => {
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


    const addSection = (index: number) => {
        console.log("-> index", index);
        console.log("-> survey.sections.slice(0, index)", survey.sections.slice(0, index));
        console.log("-> survey.sections.slice(index)", survey.sections.slice(index));

        const newSection = {
            name: 'Name this section',
            description: '',
            items: [],
            conditions: [],
        }
        surveyStore.setValue({
            ...survey,
            sections: [
                ...survey.sections.slice(0, index),
                newSection,
                ...survey.sections.slice(index),
            ]
        })
    }


    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            <div
                                onClick={ () => addSection(0) }
                                style={{
                                    width: '100%',
                                    backgroundColor: '#111',
                                    padding: '12px',
                                    textAlign: 'center',
                                }}
                            >
                                <PlusOutlined/>
                            </div>
                            {survey.sections.map((section, index) => (
                                <div
                                    key={index}
                                >
                                    <Draggable draggableId={`section-${index}`} index={index}>
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
                                                            <EditOutlined/>
                                                        </Link>
                                                        <MenuOutlined
                                                            {...provided.dragHandleProps}
                                                        />
                                                    </div>
                                                    <EditableText
                                                        text={ section.name }
                                                        placeholder="Name this section!"
                                                        onUpdate={ name => surveyStore.updateSection({...section, name: name ?? 'Untitled section'}, index) }
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                    <div
                                        onClick={ () => addSection(index + 1) }
                                        style={{
                                            width: '100%',
                                            backgroundColor: '#111',
                                            padding: '12px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <PlusOutlined/>
                                    </div>
                                </div>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    );
};
