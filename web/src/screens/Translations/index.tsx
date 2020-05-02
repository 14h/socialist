import React, { useEffect, useState } from 'react';
import {
    Breadcrumb,
    Divider,
    Dropdown, Input,
    InputNumber,
    Layout,
    Menu, Select,
    Switch,
    Tabs,
    Typography
} from 'antd';

import './styles.css';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';

const { TabPane } = Tabs;
const { Content, Sider } = Layout;
const { Title, Text } = Typography;

type Translation = {
    key: number;
    en?: string;
    de?: string;
}

type Lang = 'en' | 'de';
const AVAILABLE_LANGS: Lang[] = ['en', 'de'];
const DEFAULT_TRANSLATIONS: Translation[] = [
    {
        key: 1,
        en: 'Who am I?',
        de: 'Wer bin ich?'
    },
    {
        key: 2,
        en: 'what am I doing?',
    },
]


const ItemEdit = ({item, updateItem, lang}: {item: Translation | undefined; updateItem: (item: Translation) => void; lang: Lang;}) => {
    if(!item) {
        return null;
    }

    return <>
        <Text style={{maxWidth: 200}}>{item.key}</Text>
        <Tabs defaultActiveKey={lang}>
            {
                AVAILABLE_LANGS.map((l: Lang, index: number)=>(
                    <TabPane tab={l} key={l}>
                        <>
                            <div className='option-item'>
                                <Input value={!(item) || item[l] || undefined} onChange={(e: any) => updateItem(
                                    Object.assign(
                                        {},
                                        item,
                                        {
                                            [l]: e.target.value,
                                        }
                                    )
                                )} />
                            </div>

                        </>
                    </TabPane>
                ))
            }
        </Tabs>
    </>
}

const Translations = () => {
    const [translations, setTranslations] = useState<Translation[]>([]);
    const [lang, setLang] = useState<Lang>('en');
    const [selectedItem, setSelectedItem] = useState<Translation | null>(null);

    useEffect(()=>{
        setTranslations(DEFAULT_TRANSLATIONS);
    },[]);


    // const insertNewItem = (index: number) => {
    //     const list = surveyList.slice();
    //     list.splice(index, 0, {name: 'new_item', title: 'New Item, please change name and title', type: 'page'})
    //     setSurveyList(list);
    // };
    const deleteItem = (index: number) => {
        const list = translations.slice();
        list.splice(index, 1);
        setTranslations(list);
    };

    return (
        <>
            <Breadcrumb style={{ margin: '16px 0', textAlign: 'center' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/translation">Translation</Link>
                </Breadcrumb.Item>
            </Breadcrumb>
            <Layout className="surveys-container-layout">
                <Sider width={300} theme="light" className='sider'>
                    <Select defaultValue={lang} value={lang} style={{ width: 120 }} onChange={(target)=>{setLang(target)}}>
                        {AVAILABLE_LANGS.map((l: Lang)=>(
                            <Select.Option key={l} value={l}>{l}</Select.Option>
                        ))}
                    </Select>
                    <div className='sider-list'>
                        {translations.map((item: Translation, index: number) => (
                            <div
                                className={ `sider-item ${selectedItem?.key === item.key && 'sider-item-selected'} ${!item[lang] && 'sider-item-warning'}`}
                                key={`surveyListItem-${index}`}
                            >
                                <Dropdown
                                    overlay={
                                        <Menu>
                                            <Menu.Item onClick={() => deleteItem(index)}>
                                                Delete Item
                                            </Menu.Item>
                                        </Menu>
                                    }
                                    trigger={['contextMenu']}
                                >
                                    <div className="survey-item-option" onClick={()=>setSelectedItem(item)}>{item.key}</div>
                                </Dropdown>
                            </div>
                        ))}
                    </div>
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content className="edit-survey-content">

                        {
                            selectedItem && <ItemEdit
                              item={selectedItem}
                              updateItem={
                                  (newItem: Translation) =>  {
                                      const newTranslations = translations.slice();
                                      newTranslations[translations.findIndex(item => item.key === selectedItem.key)] = newItem
                                      setTranslations(
                                          newTranslations
                                      )
                                  }
                              }
                              lang={ lang }
                            />
                        }

                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default Translations;
