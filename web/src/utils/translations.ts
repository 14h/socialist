import { translations } from '../screens/EditSurvey/types';

const getTranslation = (translationId: string) => {
    return translations.find(t => t.key === translationId) || {}
}

const setTranslation = (translationId: string, newTranslation: string, lang: string) => {
    const translationIndex = translations.findIndex(t => t.key === translationId);

}
