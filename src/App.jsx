import {Routes, Route,useParams} from 'react-router-dom';
import DefaultGenData from '@/frontend/pages/DefaultGenData';
import GenSQL from '@/frontend/pages/GenSQL';
import Layout from '@/frontend/component/Layout';
import Schemas from '@/frontend/pages/Schemas';
import Datasets from '@/frontend/pages/Datasets';
import GenData from '@/frontend/pages/GenData';
import {useState,useEffect} from "react";

const App= () =>{
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<DefaultGenData/>}/>
                <Route path="gen-sql" element={<GenSQL/>}/>
                <Route path="schemas" element={<Schemas/>}/>
                <Route path="datasets" element={<Datasets/>}/>
                <Route path="schemas/new" element={<DefaultGenData/>}/>
                <Route path="schemas/:schemaName" element={<GenDataWrapper/>} />
            </Route>
        </Routes>
    );
}

const GenDataWrapper = ({}) => {
    const { schemaName } = useParams();
    const [schema, setSchema] = useState(schemaName);
        useEffect(() => {
                setSchema(schemaName);
        }, [schemaName]);
    return <GenData schema={schema} setSchema={setSchema} />;
};
export default App;
