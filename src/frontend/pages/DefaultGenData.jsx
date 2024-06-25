import FakeData from '../component/gendata/FakeData.jsx';
import TabMenu from "../component/gendata/TabMenu.jsx"
import {useState} from "react";
import data from './default.json'

const DefaultGenData = () => {
    const [schema, setSchema] = useState('')
    const [fields, setFields] = useState(data.defaultFields);
    const [format, setFormat] = useState(data.defaultFormat);
  return (
    <div>
      <TabMenu></TabMenu>
      <FakeData
          schema={schema}
          setSchema={setSchema}
          fields={fields}
          formatData={format}
          setFormatData={setFormat}
          setFields={setFields}
      ></FakeData>
    </div>
  );
};
export default DefaultGenData;
