import React, { Component } from 'react';
import { connect } from 'dva';
import {
    Card, Col, Row, Button, Divider, Table, Tag, Menu, Form, Modal, DatePicker, Input,
    Select,
    Dropdown,
    Icon,
    Tooltip,
    message,
    InputNumber,
    TreeSelect,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less';
import moment from 'moment';
import DropOption from '@/components/DropOption';

const FormItem = Form.Item;

@Form.create()
@connect(({ loading, role, permission }) => ({
    listLoading: loading.effects['role/getRoles'],
    role,
    permission,
}))
class RoleList extends Component {
    state = {
        Permission: "",
    };

    componentDidMount() {
        this.getRoles();

        const { dispatch } = this.props;
        dispatch({
            type: 'permission/getAllPermissions',
        });
    }

    getRoles() {
        const { dispatch } = this.props;
        dispatch({
            type: 'role/getRoles',
            payload: this.state.Permission,
        });
    }

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({ Permission: "" }, this.getRoles());
    };

    handleSearch = e => {
        e.preventDefault();
        const { dispatch, form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            dispatch({
                type: 'role/getRoles',
                payload: fieldsValue.Permission,
            });
        });
    };

    jsonDataTree(data, parent) {
        var itemArr = [];
        for (var i = 0; i < data.length; i++) {
            var node = data[i];
            if (node.parentName == parent) {
                var newNodes = { key: node.name, value: node.name, title: node.displayName, children: this.jsonDataTree(data, node.name) };
                itemArr.push(newNodes);
            }
        }
        return itemArr;
    }

    renderSimpleForm() {
        const {
            form: { getFieldDecorator },
            permission: { allPermissions },
        } = this.props;

        const allPermissionsData = this.jsonDataTree(allPermissions, null);

        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={20} sm={24}>
                        <FormItem label="??????">
                            {getFieldDecorator('Permission', { initialValue: this.Permission })(
                                <TreeSelect
                                    style={{ width: "100%" }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    treeData={allPermissionsData}
                                    placeholder="???????????????"
                                    treeDefaultExpandAll
                                />)}
                        </FormItem>
                    </Col>
                    <Col md={4} sm={24}>
                        <span className={styles.submitButtons}>
                            <Button type="primary" htmlType="submit">??????</Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>??????</Button>
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    handleMenuClick(record, e) {
        if (e.key === '1') {
            console.log("??????" + e.key);
        }
    }

    render() {
        const columns = [
            { title: '????????????', dataIndex: 'displayName', key: 'displayName', },
            {
                title: '????????????', dataIndex: 'isStatic', key: 'isStatic',
                render: (value, row, index) => {
                    if (value)
                        return <Tag color="#2db7f5">???</Tag>;
                    else
                        return <Tag color="#f50">???</Tag>;
                },
            },
            {
                title: '????????????', dataIndex: 'isDefault', key: 'isDefault',
                render: (value, row, index) => {
                    if (value)
                        return <Tag color="#2db7f5">???</Tag>;
                    else
                        return <Tag color="#f50">???</Tag>;
                },
            },
            {
                title: '????????????', dataIndex: 'creationTime', key: 'creationTime',
                render: (value, row, index) => {
                    return moment(value).format('YYYY-MM-D h:mm:ss');
                },
            },
            {
                title: '??????', key: 'action',
                render: (value, row, index) => {
                    return (
                        <DropOption
                            onMenuClick={e => this.handleMenuClick(row, e)}
                            menuOptions={[
                                { key: '1', name: `??????` },
                            ]}
                        />
                    );
                },
            }];

        const {
            listLoading,
            role: { data },
        } = this.props;

        return (
            <PageHeaderWrapper title="????????????">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                        <div className={styles.tableListOperator}>
                            12
                        </div>
                        <Table
                            rowKey={record => record.id}
                            size={'middle'}
                            columns={columns}
                            pagination={{ pageSize: 10, total: data == undefined ? 0 : data.totalCount, defaultCurrent: 1 }}
                            loading={data == undefined ? true : false}
                            dataSource={data == undefined ? [] : data.items}
                            loading={listLoading}
                        />
                    </div>
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default RoleList;
