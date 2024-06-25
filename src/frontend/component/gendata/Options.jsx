import React, {useEffect} from 'react';
import { Space } from 'antd';
import '../../styles/global.css';
import options  from '../../constants/options.json'

const getOptionsByType = (type) => {
    const optionData = options.data.find(item => item.type === type);
    return optionData ? optionData.options : options.data.find(item => item.type === 'default').options;
};
const Options = ({ type,options,setOptions }) => {
    useEffect(()=> {
        const initialOptions = getOptionsByType(type);
        setOptions(initialOptions)
    },[type,getOptionsByType])

    const handleChange = (key, value) => {
        const newOptions = { ...options };
        newOptions[key] = value;
        setOptions(newOptions);
    };

    const optionsUI = Object.entries(options).map(([key, value]) => (
        <div key={`${type}-${key}`}>
            <label>{key}: </label>
            <input
                className="option-input"
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
            />
        </div>
    ));
    return (
        <Space wrap align="center">
        {optionsUI}
        </Space>
    );
};

export default Options;
