export type ReplyTextOption = {
    type: 'text',
    name: string,
    title: TranslationRef,
};

export type ReplyImageOption = {
    type: 'image',
    name: string,
    url: string,
};

export type ReplyOption =
    ReplyImageOption | ReplyTextOption;

export type QuestionMulti = {
    type: 'multi',
    name: string,
    description: TranslationRef,
    options: ReplyOption[],
    randomize?: boolean,
    maxOptions?: number,
};

export type QuestionFreeformText = {
    type: 'freeform-text',
    name: string,
    description: TranslationRef,
    maxCharacters?: number,
};

export type QuestionFreeformDate = {
    type: 'freeform-date',
    name: string,
    description: TranslationRef,
    notBefore?: number,
    notAfter?: number,
};

export type QuestionFreeformNumber = {
    type: 'freeform-number',
    name: string,
    description: TranslationRef,
};

export type QuestionFreeform =
    QuestionFreeformText
    | QuestionFreeformDate
    | QuestionFreeformNumber;

export type SectionConditionComparision =
    '<' | '>' | '==' | '!=' | '<=' | '>=';

export type SectionConditionExistential =
    '+' | '-';

export type SectionCondition =
    [ string, SectionConditionComparision, string ]
    | [ string, SectionConditionExistential ];

export type Section = {
    name: string,
    description: TranslationRef,
    questions: (QuestionFreeform | QuestionMulti)[],
    condition?: SectionCondition[],
};

export type Survey = Section[];

export type TranslationRef = {
    id: string,
};
