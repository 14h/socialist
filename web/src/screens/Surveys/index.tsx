import React, { PropsWithChildren } from 'react';
import { Breadcrumb, Layout, Menu, List, Avatar, Tabs } from 'antd';

import './styles.css';
import { Link } from 'react-router-dom';

const { SubMenu } = Menu;
const { TabPane } = Tabs;
const { Content, Sider } = Layout;

type Props = PropsWithChildren<{}>;

const SURVEYS_LIST = [
  {
    title: 'EditSurvey 1',
    id: 'survey_1'
  },
  {
    title: 'EditSurvey 2',
    id: 'survey_2'
  },
  {
    title: 'EditSurvey 3',
    id: 'survey_3'
  },
  {
    title: 'EditSurvey 4',
    id: 'survey_4'
  }
];

const Surveys = ({ children }: Props) => {
  return (
    <Layout className="surveys-container-layout">
      <Breadcrumb style={{ margin: '16px 0', textAlign: 'center' }}>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Surveys</Breadcrumb.Item>
      </Breadcrumb>
      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280
        }}
      >
        <List
          itemLayout="horizontal"
          dataSource={SURVEYS_LIST}
          renderItem={item => (
            <List.Item
              actions={[
                <Link to={`/surveys/${item.id}`} key="survey-edit">
                  Edit
                </Link>,
                <a key="survey-item-delete">Delete</a>
              ]}
            >
              <List.Item.Meta title={<span>{item.title}</span>} description={item.id} />
            </List.Item>
          )}
        />
      </Content>
    </Layout>
  );
};

export default Surveys;
