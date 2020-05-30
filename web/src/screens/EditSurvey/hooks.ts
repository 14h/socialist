import { SURVEY } from './types';
import { TItemFormat } from './ItemFormat';
import { useLocalStorage } from '../../utils/helpers';
import { Item } from '../../types';

export type SurveyStore = {
    list: any;
    setList: any;
    duplicateItem: any;
    insertNewItem: any;
    deleteItem: any;
    updateItem: any;
}

export const useSurvey = (surveyId: string | undefined): SurveyStore => {
    const surveyListStore: any = useLocalStorage(
        '24p_survey',
        SURVEY,
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

    const updateItem = (newItem: Item, index: number) => {
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
