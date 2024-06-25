import {useEffect, useState} from 'react';
import {Select} from 'antd';
import commonData from "../../constants/commonData.json"
import backendServer from "../../config/configs.js"
import "../../styles/global.css"

const {Option} = Select;
const DropdownList = ({onSelect}) => {
    const [dbNameList, setDBNameList] = useState([]);
    const [tableList, setTableList] = useState([]);
    const [selectedValues, setSelectedValues] = useState({
        dbType: "mysql",
        dbName: "",
        table: "",
        language: "",
        dbClient: "",
        model:""
    });

    const fetchDBNameList = (type) => {
        fetch(`${backendServer.baseUrl}/genSql/getDBNameList?dbType=${type}`, {method: 'GET'})
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            }).then(data => {
            setDBNameList(data.dbNameList);
            setSelectedValues(prevState => ({
                ...prevState,
                dbName: data.dbNameList? data.dbNameList[0] : ""
            }));
        })
            .catch((error) => {
                console.error("Error fetching DB names:", error);
            });
    };
    const fetchTableList = (dbType, dbName) => {
        fetch(`${backendServer.baseUrl}/genSql/getTableList?dbType=${dbType}&dbName=${dbName}`, {method: 'GET'})
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            }).then(data => {
            setTableList(data.tableList);
            setSelectedValues(prevState => ({
                ...prevState,
                table: data.tableList ? data.tableList[0] : ""
            }));
        })
            .catch((error) => {
                console.error("Error fetching tables:", error);
            });
    };
    const handleDropdownSelection = () => {
        onSelect(selectedValues);
    };
    const handleDBTypeChange = (dbType) => {
        setSelectedValues({...selectedValues, dbType: dbType,});
        setDBNameList([]);
        setTableList([]);
        fetchDBNameList(dbType);
    };

    const handleDBNameChange = (dbName) => {
        setSelectedValues({...selectedValues, dbName: dbName});
        setTableList([]);
        fetchTableList(selectedValues.dbType, dbName);
    };
    const handleDropdownChange = (label, value) => {
        setSelectedValues(prevState => ({
            ...prevState,
            [label]: value
        }));
    };
    useEffect(() => {
        handleDropdownSelection();
    }, [selectedValues]);

    useEffect(() => {
        if (selectedValues.dbType) {
            fetchDBNameList(selectedValues.dbType);
        }
    }, []);
    useEffect(() => {
        if (selectedValues.dbName) {
            fetchTableList(selectedValues.dbType, selectedValues.dbName);
        }
    }, [selectedValues.dbName, selectedValues.dbType]);

    return (
        <div className="dropdown-container">
            <div className="dropdown-item">
                <label>Type:</label>
                <Select className="small-ant-select"
                        value={selectedValues.dbType}
                        onChange={handleDBTypeChange}>
                    {commonData.DBType.map((type) => (
                        <Option key={type} value={type}>{type}</Option>
                    ))}
                </Select>
            </div>
            <div className="dropdown-item">
                <label>Name:</label>
                <Select className="small-ant-select"
                        value={selectedValues.dbName}
                        onChange={handleDBNameChange}>
                    {dbNameList.map((dbName) => (
                        <Option key={dbName} value={dbName}>{dbName}</Option>
                    ))}
                </Select>
            </div>
            <div className="dropdown-item">
                <label>Table:</label>
                <Select className="big-ant-select"
                        value={selectedValues.table}
                        onChange={(value) => handleDropdownChange("table", value)}>
                    {tableList.map((tableName) => (
                        <Option key={tableName} value={tableName}>{tableName}</Option>
                    ))}
                </Select>
            </div>
            <div className="dropdown-item">
                <label>Language:</label>
                <Select className="small-ant-select"
                        value={selectedValues.language}
                        onChange={(value) => handleDropdownChange("language", value)}>
                    {commonData.Language.map((lang) => (
                        <Option key={lang} value={lang}>{lang}</Option>
                    ))}
                </Select>
            </div>
            <div className="dropdown-item">
                <label>Client:</label>
                <Select className="small-ant-select"
                        value={selectedValues.dbClient}
                        onChange={(value) => handleDropdownChange("dbClient", value)}>
                    {commonData.DBClient.map((client) => (
                        <Option key={client} value={client}>{client}</Option>
                    ))}
                </Select>
            </div>
                <div className="dropdown-item">
                    <label>Model:</label>
                    <Select className="small-ant-select"
                            value={selectedValues.model}
                            onChange={(value) => handleDropdownChange("model", value)}>
                        {commonData.Model.map((model) => (
                            <Option key={model} value={model}>{model}</Option>
                        ))}
                    </Select>
                </div>
            </div>
    );
};
export default DropdownList;
