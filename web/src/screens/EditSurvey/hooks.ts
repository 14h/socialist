import { SURVEY, SurveyListItem } from './types';
import { TItemFormat } from './ItemFormat';
import { useLocalStorage } from '../../utils/helpers';
import { Survey } from '../../types';

export type SurveyStore = {
    list: any;
    setList: any;
    duplicateItem: any;
    insertNewItem: any;
    deleteItem: any;
    updateItem: any;
}


const mapSurveyToSurveyList = (survey: Survey): SurveyListItem[] => {
    const surveyListBase: SurveyListItem[] = [];

    for (const page of survey.pages) {
        surveyListBase.push({
            type: 'page',
            name: page.name,
            title: page.title,
            conditions: page.conditions,
        });
        surveyListBase.push(...page.questions);
    }
    return surveyListBase;
};

export const useSurvey = (surveyId: string | undefined): SurveyStore => {
    const surveyListStore: any = useLocalStorage(
        '24p_survey',
        mapSurveyToSurveyList(SURVEY),
    );
    const [list, setList] = surveyListStore;


    const duplicateItem = (index: number) => {
        const listClone = list.slice();
        listClone.splice(
            index + 1,
            0,
            Object.assign({}, list[index], { name: `${list[index].name}_duplicate` }),
        );
        setList(list);
    };
    const insertNewItem = (
        index: number,
        type: TItemFormat,
    ) => {
        const listClone = list.slice();
        listClone.splice(index, 0, {
            name: 'new_item',
            title: 'New Item, please change name and title',
            type,
        });
        setList(list);
    };
    const deleteItem = (index: number) => {
        const listClone = list.slice();
        listClone.splice(index, 1);
        setList(list);
    };

    const updateItem = (newItem: SurveyListItem, index: number) => {
        const listClone = list.slice();
        listClone[index] = newItem;
        setList(listClone);
    }

    return {
        list,
        setList,
        duplicateItem,
        insertNewItem,
        deleteItem,
        updateItem,
    }
}
