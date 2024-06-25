import {Select} from "antd";
import commonData from "../../constants/commonData.json"
import "../../styles/global.css"

const DataFormat = ({data, onUpdate}) => {

    const handleLineChange = (event) => {
        const {value} = event.target;
        onUpdate({...data, lines: value});
    };

    const handleFormatSelectChange = (value) => {
        onUpdate({...data, format: value});
    };

    const handleLineEndingChange = (value) => {
        onUpdate({...data, lineEnding: value});
    };
    const handleModelChange = (value) => {
        onUpdate({...data, model: value});
    };

    return (
            <div className="container">
                <div className="dropdown-item">
                    <label>Model:</label>
                    <Select className="small-ant-select"
                            value={data.model}
                            onChange={handleModelChange}>
                        {commonData.Model.map((model) => (
                            <Option key={model} value={model}>{model}</Option>
                        ))}
                    </Select>
                </div>
                <div className="dropdown-item">
                    <label>Format:</label>
                    <Select className="small-ant-select"
                            value={data.format}
                            onChange={handleFormatSelectChange}>
                        {commonData.Format.map((format) => (
                            <Option key={format} value={format}>{format}</Option>
                        ))}
                    </Select>
                </div>
                <div className="dropdown-item">
                    <label>Line Ending:</label>
                    <Select className="small-ant-select"
                            value={data.lineEnding}
                            onChange={handleLineEndingChange}>
                        {commonData.LineEnding.map((line) => (
                            <Option key={line} value={line}>{line}</Option>
                        ))}
                    </Select>
                </div>
                <div className="container">
                    <label>Rows:</label>
                    <input id="lines"
                           name="lines"
                           value={data.lines}
                           className="customer-input"
                           onChange={handleLineChange}/>
                </div>
            </div>);};
export default DataFormat;
