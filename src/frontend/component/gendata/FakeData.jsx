import {useEffect, useState} from 'react';
import '../../styles/global.css';
import '../../styles/field.css';
import {Button, Spin, Modal, Input, Form, Select} from "antd";
import Field from "./Field.jsx";
import styles from './FakeData.module.less';
import {LoadingOutlined} from '@ant-design/icons';
import DataFormat from "./DataFormat.jsx";
import backendServer from "../../config/configs.js";

const FakeData = ({schema, setSchema, fields, setFields, formatData, setFormatData}) => {
    const [loading, setLoading] = useState(false);
    const [datasetName, setDatasetName] = useState("");
    const [datasetList, setDatasetList] = useState([]);

    const handelDatasetChange = (value) => {
        setDatasetName(value)
    }
    const updateFormatData = (newFormatData) => {
        setFormatData(newFormatData);
    };
    const addField = () => {
        setFields([
            ...fields,
            {
                name: '',
                type: '',
                options: {"blank": "0%"},
            },
        ]);
    };

    const removeField = (index) => {
        const newFields = fields.filter((_, idx) => idx !== index);
        setFields(newFields);
    };

    const updateField = (index, data) => {
        const newFields = [...fields];
        newFields[index] = {...newFields[index], ...data};
        setFields(newFields);
    };
    const removeAll = () => {
        setFields([]);
    };
    const genData = async (formatData, fields) => {
        let fakeData;
        try {
            setLoading(true);
            const response = await fetch(`${backendServer.baseUrl}/genData/data`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    model: formatData.model,
                    fileType: formatData.format,
                    lines: formatData.lines,
                    dataTypes: fields
                })
            })
            if (response.ok) {
                const responseData = await response.json();
                fakeData = responseData.fakeData;
                return fakeData;
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const getDatasetValue = async (datasetName) => {
        try {
            const response = await fetch(`${backendServer.baseUrl}/genData/datasets/getValue?name=${datasetName}`,{
                method: "GET",
                headers: {"Content-Type":"application/json"}
            });
            if (response.ok) {
                const responseData = await response.json();
                const rs = responseData ? responseData.datasetValue : [];
                return rs
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const downloadData = async (generateData) => {
        let csvData = convertToCSV(generateData);
        if(datasetName) {
        const appendData = await getDatasetValue(datasetName)
            csvData = appendDatasetToCsv(csvData, appendData)
        }
        const blob = new Blob([csvData], {type: 'text/csv'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'generated_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    function convertToCSV(data) {
        const lines = data.split('\n');
        const csvRows = [];
        lines.forEach((line) => {
            const values = line.split(',');
            const csvLine = values.map((value) => `${value}`).join(',');
            csvRows.push(csvLine);
        });
        const csvContent = csvRows.join('\n');
        return validateAndTrimCSV(csvContent);
    }

    function validateAndTrimCSV(input) {
        const csvStartMarker = '```csv';
        const csvEndMarker = '```';
        if (input.startsWith(csvStartMarker) && input.endsWith(csvEndMarker)) {
            return input.slice(csvStartMarker.length, -csvEndMarker.length).trim();
        }
        return input;
    }

    function appendDatasetToCsv(originalCsv, datasetValues) {
        const csvLines = originalCsv.split('\n');
        const headers = csvLines[0].split(',');
        const hasIdField = headers.includes('id');
        let lastId = 0;
        if (hasIdField) {
            csvLines.slice(1).forEach(line => {
                const id = parseInt(line.split(',')[headers.indexOf('id')], 10);
                if (id > lastId) {
                    lastId = id;
                }
            });
        }
        const newRows = datasetValues.map((row, index) => {
            let newRow = {...row};
            if (hasIdField) {
                newRow.id = (parseInt(row.id, 10) + lastId + 1).toString();
            }
            return headers.map(header => newRow[header] || '').join(',');
        });
        return [csvLines.join('\n'), ...newRows].join('\n');
    }


    const generateData = async () => {
        let generatedData = await genData(formatData, fields);
        await downloadData(generatedData);
    };

    const addSchema = async (name, schemas, format) => {
        try {
            const response = await fetch(`${backendServer.baseUrl}/genData/addSchema`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    name: name,
                    schemas: schemas,
                    format: format,
                })
            })
            if (response.ok) {
                console.log('Message',"add schema successfully")
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const getDatasetList = async () => {
        try {
            const response = await fetch(`${backendServer.baseUrl}/genData/datasets/getDatasetList`, {
                method: "GET",
                headers: {"Content-Type": "application/json"}
            })
            if (response.ok) {
                const responseData = await response.json();
                const rs = responseData ? responseData.datasets.map(item => item.name) : [];
                setDatasetList(rs);
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getDatasetList();
    }, [])
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const showDialog = () => {
        setIsDialogVisible(true);
    };

    const handleDialogOk = async () => {
        await addSchema(schema, fields, formatData)
        setIsDialogVisible(false);
    };

    const handleDialogCancel = () => {
        setIsDialogVisible(false);
    };
    return (
        <div>
            <div className="title-container">
                <label>Name</label>
                <label>Type</label>
                <label>Options</label>
            </div>
            {fields.map((field, index) => (
                <Field
                    key={index}
                    data={field}
                    onRemove={() => removeField(index)}
                    onUpdate={(data) => updateField(index, data)}
                />
            ))}
            <div className="container">
                <Button className={styles.button} onClick={addField}>
                    AddFiled
                </Button>
                <Button className={styles.button} onClick={removeAll}>
                    RemoveAll
                </Button>
                <Button className={styles.button}
                        icon={loading ? <Spin indicator={<LoadingOutlined spin/>}/> : null}
                        disabled={loading}
                        onClick={generateData}>GenData </Button>
                <Button className={styles.button} onClick={showDialog}>Save As</Button>
                <SaveSchemaDialog
                    visible={isDialogVisible}
                    onOk={handleDialogOk}
                    onCancel={handleDialogCancel}
                    schema={schema}
                    setSchema={setSchema}
                />
            </div>
            <DataFormat
                data={formatData}
                onUpdate={(formatData) => updateFormatData(formatData)}
            ></DataFormat>
            <div>
                <div className="dropdown-item">
                    <label>Append Dataset:</label>
                    <Select className="small-ant-select"
                            value={datasetName}
                            onChange={handelDatasetChange}>
                        {datasetList.map((dataset) => (
                            <Option key={dataset} value={dataset}>{dataset}</Option>
                        ))}
                    </Select>
                </div>
            </div>
        </div>
    );
};

const SaveSchemaDialog = ({visible, onOk, onCancel, schema, setSchema}) => {
    const handleInputChange = (e) => {
        setSchema(e.target.value);
    };
    return (
        <Modal
            title="Save Schema"
            open={visible}
            onOk={onOk}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="save" type="primary" onClick={onOk}>
                    Save
                </Button>,
            ]}
        >
            <Form layout="row">
                <Form.Item label="Name:">
                    <Input value={schema} onChange={handleInputChange}/>
                </Form.Item>
            </Form>
        </Modal>
    );
};
export default FakeData;
