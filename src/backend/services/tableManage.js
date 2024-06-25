import {insertTableInfo, insertDBName, queryDBName, queryTableInfo} from '../database/crudSqlTable.js';
import {connectDB} from '../database/base.js'

function parseMysqlSchema(sqlContent) {
    try {
        const tables = [];
        const tableNameRegex = /-- Table structure for table `(\w+)`/g;
        let tableNameMatch;
        while ((tableNameMatch = tableNameRegex.exec(sqlContent)) !== null) {
            const tableName = tableNameMatch[1];
            const createTableRegex = new RegExp(`CREATE TABLE \`${tableName}\`([\\s\\S]+?) ENGINE=InnoDB DEFAULT`, 'i');
            const createTableMatch = createTableRegex.exec(sqlContent);
            if (createTableMatch) {
                const createTableStatement = createTableMatch[0];
                tables.push({tableName: tableName, schema: createTableStatement})
            }
        }
        return tables;
    } catch (error) {
        console.error('Error parsing MySQL schema:', error);
        return [];
    }
}

 function parsePostgreSQLSchema(sqlContent) {
    try {
        const createTableRegex = /CREATE TABLE ([^ ]+) \((.*?)\);/gs;
        let match;
        const tables = [];
        while ((match = createTableRegex.exec(sqlContent)) !== null) {
            let name = match[1];
            name = name.startsWith("public.") ? name.split('public.')[1] : name;
            const columns = match[2];
            const createTableStatement = `CREATE TABLE ${name}
                                          (
                                              ${columns}
                                          );`;
            tables.push({tableName:name, schema:createTableStatement});
        }
        return tables;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error;
    }
}

async function importTables(dbType, dbName, sqlContent) {
    try {
        await connectDB();
        let tables = [];
        if (dbType.toLowerCase() === "mysql") {
            tables = parseMysqlSchema(sqlContent);
        } else if (dbType.toLowerCase() === "postgresql") {
            tables = parsePostgreSQLSchema(sqlContent);
        }
        for (const item of tables) {
            await insertTableInfo(dbType, dbName, item.tableName, item.schema);
        }
    } catch (error) {
        console.log(error)
    }
}

async function addDBName(dbType, dbName) {
    try {
        await connectDB();
        await insertDBName(dbName, dbType);
    } catch (error) {
        console.log(error);
    }
}

async function getDBNameList(dbType) {
    try {
        await connectDB();
        const query = {db_type: dbType};
        const rs = await queryDBName(query);
        return rs.length > 0 ? rs.map(item => item.db_name) : [];
    } catch (error) {
        console.error('Error querying db name:', error);
    }
}

async function getTableList(dbType, dbName) {
    try {
        await connectDB();
        const query = {db_type: dbType, db_name: dbName};
        const rs = await queryTableInfo(query);
        return rs.length > 0 ? rs.map(item => item.table_name) : [];
    } catch (error) {
        console.error('Error querying tables:', error);
    }
}

async function getTableSchemaList(dbType, dbName, tableNames) {
    try {
        await connectDB();
        const query = {db_type: dbType, db_name: dbName, table_name: {$in: tableNames}}
        const rs = await queryTableInfo(query);
        return rs.length > 0 ? rs.map(item => item.table_schema) : [];
    } catch (error) {
        console.error('Error querying table schema:', error)
    }
}

export {importTables, addDBName, getDBNameList, getTableList, getTableSchemaList}
