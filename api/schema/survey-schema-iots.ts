import * as t from 'io-ts';

const optional = <T>(type: t.Type<T>) => t.union([type, t.undefined]);

export const translationRef = t.type({
    id: t.string,
    lang: optional(t.string),
    data: optional(t.string),
});

export const questionMultiReplyOptionText =
    t.type({
        type: t.literal('text'),
        name: t.string,
        title: translationRef,
    });

export const questionMultiReplyOptionImage =
    t.type({
        type: t.literal('image'),
        name: t.string,
        url: t.string,
    });

export const questionMultiReplyOption =
    t.union([
        questionMultiReplyOptionText,
        questionMultiReplyOptionImage,
    ]);

export const questionMulti =
    t.type({
        type: t.literal('multi'),
        name: t.string,
        description: translationRef,
        options: t.array(questionMultiReplyOption),
        randomize: optional(t.boolean),
        maxOptions: optional(t.number),
    });

export const questionFreeformText =
    t.type({
        type: t.literal('freeform-text'),
        name: t.string,
        description: translationRef,
        maxCharacters: optional(t.number),
    });

export const questionFreeformDate =
    t.type({
        type: t.literal('freeform-date'),
        name: t.string,
        description: translationRef,
        notBefore: optional(t.number),
        notAfter: optional(t.number),
    });

export const questionFreeformNumber =
    t.type({
        type: t.literal('freeform-number'),
        name: t.string,
        description: translationRef,
        min: optional(t.number),
        max: optional(t.number),
    });

export const questionFreeform =
    t.union([
        questionFreeformText,
        questionFreeformDate,
        questionFreeformNumber,
    ]);

export const surveyQuestion =
    t.union([
        questionFreeform,
        questionMulti,
    ]);

export const surveySectionConditionComparision =
    t.union([
        t.literal('<'),
        t.literal('>'),
        t.literal('=='),
        t.literal('!='),
        t.literal('<='),
        t.literal('>='),
    ]);

export const sectionConditionExistential =
    t.union([
        t.literal('+'),
        t.literal('-'),
    ]);

export const surveySectionCondition =
    t.union([
        t.tuple([t.string, surveySectionConditionComparision, t.string]),
        t.tuple([t.string, sectionConditionExistential]),
    ]);

export const surveySection = t.type({
    name: t.string,
    description: translationRef,
    questions: t.array(surveyQuestion),
    condition: optional(surveySectionCondition),
});
