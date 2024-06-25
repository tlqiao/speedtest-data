import FakeData from '../component/gendata/FakeData.jsx';
import TabMenu from "../component/gendata/TabMenu.jsx"
import {useEffect, useState} from "react";
import data from './default.json'
import backendServer from "../config/configs.js";

const GenData = ({schema, setSchema}) => {
    const [fields, setFields] = useState(data.defaultFields);
    const [format, setFormat] = useState(data.defaultFormat);
    const getSchemaInfo = async (schema) => {
        try {
            const response = await fetch(`${backendServer.baseUrl}/genData/schemas/getSchema?name=${schema}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
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
    useEffect(()=> {
        const fetchSchemaInfo = async()=> {
            const result = await getSchemaInfo(schema)
            setFields(result.schemas);
            setFormat(result.format);
        };
        fetchSchemaInfo();
    },[])
    return (
        <div>
            <TabMenu></TabMenu>
            <FakeData
                schema={schema}
                setSchema={setSchema}
                formatData={format}
                fields={fields}
                setFormatData={setFormat}
                setFields={setFields}
            ></FakeData>
        </div>
    );
};
export default GenData;
