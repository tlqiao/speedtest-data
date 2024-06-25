import {useState} from 'react';
import {Button, Upload, message} from "antd";
import DropdownList from "../component/gensql/DropdownList";
import "../styles/global.css"
import backendServer from "../config/configs.js";
import styles from './pages.module.less';
import { UploadOutlined } from '@ant-design/icons';


const GenSQL = () => {
    const [selectedDropdownValues, setSelectedDropdownValues] = useState({});
    const [dbName, setDBName] = useState('')
    const [naturalSql, setNaturalSql] = useState('')
    const [selectTableList, setSelectedTableList] = useState([]);
    const [outPut, setOutPut] = useState('')
    const handleDBInputChange = (event) => {
        setDBName(event.target.value)
    }
    const handelAddDBName = async () => {
        const data = {
            dbType: selectedDropdownValues.dbType,
            dbName: dbName,
        }
        try {
            const response = await fetch(`${backendServer.baseUrl}/genSql/addDB`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            })
            if (response.ok) {
                const responseData = await response.json();
                alert("Add DB name successfully")
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.log(error)
        }
    }
    const fetchTableSchema = async () => {
        const data = {
            "dbType": selectedDropdownValues.dbType,
            "dbName": selectedDropdownValues.dbName,
            "tableNames": selectTableList,
        };
        try {
            const response = await fetch(`${backendServer.baseUrl}/genSql/getTableSchema`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            })
            if (response.ok) {
                const responseData = await response.json();
                const result = responseData.tableSchemaList.join(', ')
                return result
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handelGenSql = async () => {
        try {
            const response = await fetch(`${backendServer.baseUrl}/genSql/sql`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    model: selectedDropdownValues.model,
                    dbType: selectedDropdownValues.dbType,
                    dbName: selectedDropdownValues.dbName,
                    sqlTables: selectTableList,
                    naturalSql: naturalSql,
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const reader = response.body.getReader();
            let result = '';
            while (true) {
                const {done, value} = await reader.read();
                if (done) break;
                result += new TextDecoder('utf-8').decode(value);
                setOutPut(result);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const handelGenSqlCode = async () => {
        try {
            const response = await fetch(`${backendServer.baseUrl}/genSql/genCode`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    model: selectedDropdownValues.model,
                    sql: outPut,
                    language: selectedDropdownValues.language,
                    clientTool: selectedDropdownValues.clientTool,
                }),
            });
            const reader = response.body.getReader();
            let result = '';
            while (true) {
                const {done, value} = await reader.read();
                if (done) break;
                result += new TextDecoder('utf-8').decode(value);
                setOutPut(result);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleGetTableSchema = async () => {
        const rs = await fetchTableSchema();
        setOutPut(rs);
    }

    const handleDropdownListSelection = (selectedValues) => {
        setSelectedDropdownValues(selectedValues);
    };

    const handleChooseTable = () => {
        setSelectedTableList(prevTableList => [...prevTableList, selectedDropdownValues.table]);
    };
    const handleClearTable = () => {
        setSelectedTableList([]);
    };

    const beforeUpload = (file) => {
        const isSQL = file.name.endsWith('.sql');
        if (!isSQL) {
            message.error('You can only upload .sql files!');
        }
        return isSQL;
    };
    const customRequest = async ({file, onSuccess, onError}) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const content = e.target.result;
            const data = {
                dbType: selectedDropdownValues.dbType,
                dbName: selectedDropdownValues.dbName,
                tableSchemas: content,
            };
            try {
                const response = await fetch(`${backendServer.baseUrl}/genSql/import`, {
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
            <DropdownList onSelect={handleDropdownListSelection}/>
            <div className="container">
                <Button className={styles.button} onClick={handleChooseTable}>Choose Table</Button>
                <Button className={styles.button} onClick={handleClearTable}>Clear Table</Button>
                <Button className={styles.button} onClick={handleGetTableSchema}>Review Table</Button>
                <Button className={styles.button} onClick={handelGenSql}>Gen SQL</Button>
                <Button className={styles.button} onClick={handelGenSqlCode}>Gen SQL Code</Button>
                <input  className="customer-input"
                       placeholder="input db name"
                       value={dbName}
                       onChange={handleDBInputChange}
                />
                <Button className={styles.button} onClick={handelAddDBName}>Add DB</Button>
                <Upload {...props} accept=".sql">
                    <Button icon={<UploadOutlined/>} className={styles.button}>Upload</Button>
                </Upload>
            </div>
            <div className="container">
                <textarea
                    className="custom-textarea"
                    placeholder="Input sql query nature language or customer request"
                    value={naturalSql}
                    onChange={(e) => setNaturalSql(e.target.value)}>
                </textarea>
                <textarea
                    className="custom-textarea"
                    placeholder="Show selected table"
                    readOnly={true}
                    value={selectTableList.join(', ')}>
                </textarea>
            </div>
            <div className="container">
                <textarea
                    className="big-customer-textarea"
                    placeholder="Show sql and code in here"
                    value={outPut}
                    onChange={(e) => setOutPut(e.target.value)}>
                </textarea>
            </div>
        </div>
    );
};

export default GenSQL;
