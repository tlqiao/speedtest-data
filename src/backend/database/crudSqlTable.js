import mongoose from 'mongoose';

const dbNameSchema = new mongoose.Schema({
    db_name: String,
    db_type:String
})
const DBName = mongoose.model('DBName', dbNameSchema)
const insertDBName = async (dbname,dbType) => {
    try {
        const dbName = new DBName ({db_name: dbname,db_type: dbType})
        await dbName.save()
        console.log('DBName document created: ', dbName)
    } catch (error) {
        console.error('Error creating dbname document:', error);
    }
}

const queryDBName = async (query) => {
    try {
        const rs = await DBName.find(query);
        return rs;
    } catch (error) {
        console.error('Error querying db name:', error);
        throw error;
    }
};

const tableInfoSchema = new mongoose.Schema({
    table_name: String,
    db_name: String,
    db_type: String,
    table_schema: Object
});

const TableInfo = mongoose.model('TableInfo', tableInfoSchema);

const createTableInfo = async (tableName, dbName, dbType, tableSchema) => {
    try {
        const tableInfo = new TableInfo({
            db_type: dbType,
            db_name: dbName,
            table_name: tableName,
            table_schema: tableSchema
        });
        await tableInfo.save();
        console.log('Table info document created:', tableInfo);
    } catch (error) {
        console.error('Error creating table info document:', error);
    }
};

const queryTableInfo = async (query) => {
    try {
        const result = await TableInfo.find(query);
        return result
    } catch (error) {
        console.error('Error querying table info:', error);
    }
};

const insertTableInfo = async (dbType, dbName, tableName, tableSchema) => {
    try {
        const existingRecord = await TableInfo.findOne({db_type: dbType, db_name: dbName, table_name: tableName});
        if (existingRecord) {
            existingRecord.table_schema = tableSchema;
            await existingRecord.save();
            console.log('Table info document updated:', existingRecord);
        } else {
            const tableInfo = new TableInfo({
                db_type: dbType,
                db_name: dbName,
                table_name: tableName,
                table_schema: tableSchema
            });
            await tableInfo.save();
            console.log('Table info document inserted:', tableInfo);
        }
    } catch (error) {
        console.error('Error inserting table info document:', error);
    }
};

export {queryTableInfo, insertTableInfo,insertDBName,queryDBName};
