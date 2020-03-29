export type ReplyTextOption = {
    type: 'text',
    name: string,
    title: string,
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
    options: ReplyOption[],
    randomize?: boolean,
    maxOptions?: number,
};

export type QuestionFreeformText = {
    type: 'freeform-text',
    name: string,
    title: string,
    maxCharacters?: number,
};

export type QuestionFreeformDate = {
    type: 'freeform-date',
    name: string,
    title: string,
    notBefore?: number,
    notAfter?: number,
};

export type QuestionFreeformNumber = {
    type: 'freeform-number',
    name: string,
    title: string,
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
    condition?: SectionCondition[],
    questions: QuestionFreeform | QuestionMulti,
};
