import React, { useState,useEffect } from 'react';
import { Table, Button, Input, Space } from 'antd';
import { DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './pages.module.less';
import { useNavigate } from 'react-router-dom';
import backendServer from "../config/configs.js";
import { Link } from 'react-router-dom';



const Schemas = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState('');

    const getSchemaList = async()=>{
        try {
            const response = await fetch(`${backendServer.baseUrl}/genData/schemas/getSchemaList`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data.schemaList);
            return data.schemaList;
        } catch (error) {
            console.error('Error fetching schema list:', error);
        }
    };

    const deleteSchema = async(schemaName) => {
        try {
            const response  = await fetch (`${backendServer.baseUrl}/genData/schemas/${schemaName}`,
                {method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }})
            if(!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {console.error('Error delete schema: ', error)}
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getSchemaList();
                setData(res);
                setFilteredData(res)
            } catch (error) {
                console.error('Error fetching schema list:', error);
            }
        };
        fetchData();
    }, []);

    const onSelectChange = selectedKeys => {
        setSelectedRowKeys(selectedKeys);
    };

    const handleDelete = async (record) => {
        await deleteSchema(record.name)
        const newData= data.filter(item => item.key !== record.key);
        setData(newData);
        setFilteredData(newData);
    };
    const handleClick = () => {
        navigate('/schemas/new');
    };
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchText(value);
        const filtered = data.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
        setFilteredData(filtered);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Link to={`/schemas/${record.name}`} className={styles.link}>{text}</Link>
            ),
        },
        {
            title: 'Update Time',
            dataIndex: 'updateTime',
            key: 'updateTime',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <DeleteOutlined
                    onClick={() => handleDelete(record)}
                    style={{ color: 'red', cursor: 'pointer' }}
                />
            ),
        },
    ];

    return (
        <div >
            <div className={styles.header}>
            <Space style={{ marginBottom: 16 }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleClick}>
                    Create Schema
                </Button>
                <Input
                    placeholder="Search"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={handleSearch}
                    style={{ width: 200 }}
                />
            </Space>
            </div>
            <Table
                rowSelection={{
                    selectedRowKeys,
                    onChange: onSelectChange,
                }}
                columns={columns}
                dataSource={filteredData}
            />
        </div>
    );
};
export default Schemas;
