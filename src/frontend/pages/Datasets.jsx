import React, {useEffect, useState} from 'react';
import {Table, Button, Input, Space, Upload, message} from 'antd';
import {DeleteOutlined, SearchOutlined, UploadOutlined} from '@ant-design/icons';
import styles from './pages.module.less';
import backendServer from "../config/configs.js";
import '../styles/global.css'

const Datasets = () => {
    const [datasetName, setDatasetName] = useState('');
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [datasets, setDatasets] = useState([]);
    const [filterDatasets, setFilterDatasets] = useState([]);
    const [searchText, setSearchText] = useState('');

    const getDatasetList = async () => {
        try {
            const response = await fetch(`${backendServer.baseUrl}/genData/datasets/getDatasetList`, {
                'method': 'GET',
                headers: {'Content-Type': 'application/json',}
            })
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data.datasets;

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        const fetchDataSets = async () => {
            try {
                const datasetList = await getDatasetList();
                setDatasets(datasetList);
                setFilterDatasets(datasetList);
            } catch (error) {
                console.log(error)
            }
        };
        fetchDataSets();
    }, [])
    const onSelectChange = selectedKeys => {
        setSelectedRowKeys(selectedKeys);
    };
    const deleteDataset = async (datasetName) => {
        try {
            const response = await fetch(`${backendServer.baseUrl}/genData/datasets/${datasetName}`,{
                "method":"DELETE",
                "Content-Type":"application/json"
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error)
        }
    }

    const handleDelete = async (record) => {
        await deleteDataset(record.name)
        let newDatasets = datasets.filter(item => item.key !==record.key)
        setDatasets(newDatasets);
        setFilterDatasets(newDatasets)
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'File',
            dataIndex: 'fileName',
            key: 'file',
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
                    style={{color: 'red', cursor: 'pointer'}}
                />
            ),
        },
    ];
    const handelChange = (e) => {
        setDatasetName(e.target.value)
    }
    const handelSearch = (e) => {
        const value = e.target.value;
        setSearchText(value);
        const filtered = datasets.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
        setFilterDatasets(filtered);
    }
    const beforeUpload = (file) => {
        const isCsv = file.name.endsWith('.csv');
        if (!isCsv) {
            message.error('You can only upload .csv files!');
        }
        return isCsv;
    };
    const customRequest = async ({file, onSuccess, onError}) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const csvData = e.target.result;
            const data = {
                datasetName: datasetName,
                fileName: file.name,
                csvContent: csvData,
            };
            try {
                const response = await fetch(`${backendServer.baseUrl}/genData/datasets/import`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                if (response.ok) {
                    onSuccess(response.data, file);
                } else {
                    throw new Error('Upload failed');
                }

            } catch (error) {
                throw new Error(`Failed to call backend API: ${error.message}`);
            }
        }
        reader.readAsText(file);
    };

    const props = {
        name: 'file',
        customRequest,
        beforeUpload,
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <div>
            <div>
                <Space style={{marginBottom: 16}}>
                    <input className="customer-input"
                           placeholder="Input datasets name"
                           value={datasetName}
                           onChange={handelChange}/>
                    <Upload {...props} accept=".csv">
                        <Button icon={<UploadOutlined/>} className={styles.button}>Upload</Button>
                    </Upload>
                    <Input
                        placeholder="Search"
                        value={searchText}
                        prefix={<SearchOutlined/>}
                        onChange={handelSearch}
                        style={{width: 200}}
                    />
                </Space>
            </div>
            <Table
                rowSelection={{
                    selectedRowKeys,
                    onChange: onSelectChange,
                }}
                columns={columns}
                dataSource={filterDatasets}
            />
        </div>
    );
};
export default Datasets;

