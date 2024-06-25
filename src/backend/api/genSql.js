import {importTables, addDBName, getDBNameList, getTableList, getTableSchemaList} from '../services/tableManage.js'
import express from 'express';
import {genSQLCode,genSQL} from '../llm/genSqlChain.js'

const genSqlRouter = express.Router();

genSqlRouter.post('/genSql/import', async (req, res) => {
    const {dbType, dbName, tableSchemas} = req.body;
    await importTables(dbType, dbName, tableSchemas);
    res.status(200).json({message: 'Import schema sql file successfully'});
});

genSqlRouter.post('/genSql/addDB', async (req, res) => {
    const {dbType, dbName} = req.body;
    await addDBName(dbType, dbName);
    res.status(200).json({message: 'Add Database successfully'})
});

genSqlRouter.get('/genSql/getDBNameList', async (req, res, next) => {
    try {
        let dbType = req.query.dbType || 'mysql';
        const dbNameList = await getDBNameList(dbType);
        res.status(200).json({"dbNameList": dbNameList});
    } catch (error) {
        console.error(error);
        res.status(500).json({"error": "Internal Server Error"});
    }
});

genSqlRouter.get('/genSql/getTableList', async (req, res) => {
    try {
        let dbType=req.query.dbType || 'mysql';
        let dbName=req.query.dbName || '';
        const tableList= await getTableList(dbType,dbName);
        res.status(200).json({"tableList": tableList})
    } catch (error) {
        console.error(error);
        res.status(500).json({"error": "Internal Server Error"})
    }
})

genSqlRouter.post('/genSql/getTableSchema',async(req,res)=> {
    try {
        const {dbType, dbName, tableNames} = req.body;
        const tableSchemas = await getTableSchemaList(dbType,dbName,tableNames)
        res.status(200).json({"tableSchemaList":tableSchemas})
    } catch (error) {
        console.log(error)
        res.status(500).json({"error": "Internal Server Error"})
    }

})

genSqlRouter.post('/genSql/sql', async (req, res) => {
    try {
        const { model, dbType,dbName,sqlTables,naturalSql} = req.body;
        const tableSchemas = await getTableSchemaList(dbType,dbName,sqlTables)
        console.log("===table schemas==" + tableSchemas);
        const result = await genSQL(model, tableSchemas,naturalSql);
        res.set({'Content-Type': 'text/plain'});
        for await (const chunk of result) {
            res.write(chunk);
        }
    } catch (error) {
        console.error('Error generating SQL:', error);
        res.status(500).send('Internal Server Error');
    }
});
genSqlRouter.post('/genSql/genCode', async (req, res) => {
    try {
        const { model, sql, language, clientTool } = req.body;
            const result = await genSQLCode(model, sql, language, clientTool);
            res.setHeader('Content-Type', 'text/plain');
            res.flushHeaders();
            for await (const chunk of result) {
                console.log(chunk);
                res.write(chunk);
            }
        } catch (error) {
            console.error('Error generating SQL code:', error);
            res.status(500).send('Internal Server Error');
        }
});


export default genSqlRouter;
