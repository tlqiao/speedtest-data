import express from 'express';
import {genFakeData} from '../llm/genDataChain.js'
import {getSchema, addSchemas, getFieldNameList, getSchemaList, deleteSchema} from '../services/schemaManage.js'
import {uploadCsv, getDatasetList, deleteDataset, processDatasetValue} from "../services/datasetsManage.js";

const genDataRouter = express.Router();

genDataRouter.post('/genData/data', async (req, res) => {
    try {
        const {model, fileType, lines, dataTypes} = req.body;
        let result = await genFakeData(model, fileType, lines, dataTypes);
        res.status(200).json({"fakeData": result});
    } catch (error) {
        console.log(error);
        res.status(500).json({"error": "Internal Server Error"});
    }
})

genDataRouter.get('/genData/datasets/getValue', async (req, res) => {
    try {
        const datasetName = req.query.name;
        const result = await processDatasetValue(datasetName);
        res.status(200).json({"datasetValue": result})
    } catch (error) {
        console.log(error);
        res.status(500).json({"error": "Internal Server Error"})
    }
})

genDataRouter.post('/genData/addSchema', async (req, res) => {
    try {
        const {name, schemas, format} = req.body;
        await addSchemas(name, schemas, format);
        res.status(200).json({"result": "Add schema successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({"error": "Internal Server Error"})
    }
})

genDataRouter.get('/genData/schemas/getNameList', async (req, res) => {
    try {
        const name = req.query.name;
        let result = await getFieldNameList(name);
        res.status(200).json({"names": result})
    } catch (error) {
        console.log(error);
        res.status(500).json({"error": "Internal Server Error"})
    }
})

genDataRouter.get('/genData/schemas/getSchema', async (req, res) => {
    try {
        const name = req.query.name;
        let result = await getSchema(name);
        res.status(200).json({"schemas": result.schemas, "format": result.format})
    } catch (error) {
        console.log(error);
        res.status(500).json({"error": "Internal Server Error"});
    }
})
genDataRouter.get('/genData/schemas/getSchemaList', async (req, res) => {
    try {
        let result = await getSchemaList();
        res.status(200).json({"schemaList": result});
    } catch (error) {
        console.log(error);
        res.status(500).json({"error": "Internal Server Error"});
    }
})

genDataRouter.delete('/genData/schemas/:schemaName', async (req, res) => {
    const {schemaName} = req.params;
    try {
        let result = await deleteSchema(schemaName);
        if (result) {
            res.status(200).json({"message": "Schema delete successfully", "data": result});
        } else {
            res.status(404).json({"message": "Schema not found"});
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({"error": "Internal Server Error"});
    }
})

genDataRouter.delete('/genData/datasets/:datasetName', async (req, res) => {
    const {datasetName} = req.params;
    try {
        let result = await deleteDataset(datasetName);
        res.status(200).json({"message": "Dataset delete successfully", "data": result});
    } catch (error) {
        console.log(error);
        res.status(500).json({"error": "Internal Server Error"})
    }
})

genDataRouter.post('/genData/datasets/import', async (req, res) => {
    try {
        const {datasetName, fileName, csvContent} = req.body;
        await uploadCsv(datasetName, fileName, csvContent);
        res.status(200).json({"message": "upload successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({"error": "Internal Server Error"});
    }
})

genDataRouter.get('/genData/datasets/getDatasetList', async (req, res) => {
    try {
        let result = await getDatasetList();
        res.status(200).json({"datasets": result});
    } catch (error) {
        console.log(error);
        res.status(500).json({"error": "Internal Server Error"});
    }
})
export default genDataRouter
