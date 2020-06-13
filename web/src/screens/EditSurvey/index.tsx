import React, { useState } from 'react';
import { Button, Layout, Tabs, Typography } from 'antd';
import { Item, Page} from '../../types';
import { useParams } from 'react-router';
import 'react-quill/dist/quill.snow.css';
import { SurveyActions } from './Components/SurveyActions';
import { ItemFormat } from './Components/ItemFormat';
import { useSurvey, useTranslations } from '@utils/hooks';
import { PageActions } from './Components/PageActions';
import { ItemComponent } from './Components/ItemComponent';

import './styles.css';

const { Title } = Typography;

const EditSurvey = () => {
    const { survey_id } = useParams();
    const surveyStore = useSurvey(survey_id);
    const translationsStore = useTranslations();

    const [pageKey, setPageKey] = useState(surveyStore.value.pages[0].name);

    const removePage = (key: any, action: any) => {
        const pageIndex = surveyStore.value.pages.findIndex((p: Page) => p.name === key);
        if (pageIndex < 0) {
            console.warn('Page not found');
            return;
        }
        surveyStore.deletePage(pageIndex);
    }

    return (
        <div className="survey-wrapper">
            <Title className="survey-title">
                {survey_id}
                <SurveyActions />
            </Title>
            <Layout>
            <Tabs
                type="editable-card"
                onChange={setPageKey}
                activeKey={pageKey}
                onEdit={removePage}
                hideAdd={true}
                tabBarExtraContent={
                    <Button
                        onClick={surveyStore.insertNewPage}
                        style={{marginRight: '8px'}}
                    >
                        Add new page
                    </Button>
                }
                size="large"
            >
                {surveyStore.value.pages.map((page: Page, pageIndex: number) => (
                    <Tabs.TabPane tab={page.name} key={page.name} closable={true}>
                        <PageActions
                            page={page}
                            updatePage={surveyStore.updatePage}
                        />
                        <br/>
                        <ItemFormat
                            callback={
                                (type: Item['type']) => surveyStore.insertNewItem(pageIndex, 0, type)
                            }
                            className="add-new-item"
                        >
                            <Button>Add item</Button>
                        </ItemFormat>
                        {page.items.map((item: Item, itemIndex: number) => (
                            <ItemComponent
                                key={`EditSurveyListItem-${itemIndex}`}
                                item={item}
                                itemIndex={itemIndex}
                                pageIndex={pageIndex}
                                translationsStore={translationsStore}
                                surveyStore={surveyStore}
                            />
                        ))}
                    </Tabs.TabPane>
                ))}
            </Tabs>
            </Layout>
        </div>
    );
};

export default EditSurvey;
