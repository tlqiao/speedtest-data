import {insertDataSchema, querySchemas,deleteSchemaByName} from '../database/crudDataSchema.js'
import {connectDB} from "../database/base.js";

const getFieldNameList = async (schemaName) => {
    try {
        await connectDB();
        const result = await querySchemas({schema_name: schemaName});
        const names = result[0].schemas.map(item => item.name);
        return names;
    } catch (error) {
        console.log(error)
    }
}

const getSchema = async (schemaName) => {
    try {
        await connectDB();
        const rs = await querySchemas({schema_name: schemaName});
        const result = {
            schemas: rs[0].schemas,
            format: rs[0].format
        };
        return result;
    } catch (error) {
        console.log(error);
    }
}

const getSchemaList = async () => {
    try {
        await connectDB();
        const rs = await querySchemas({});
        const result = rs.map((item, index) => ({
            key: (index + 1).toString(),
            name: item.schema_name,
            updateTime: item.update_time
        }))
        return result;
    } catch (error) {
        console.log(error)
    }
}
const addSchemas = async (name, schemas, format) => {
    try {
        await connectDB();
        let now = new Date();
        await insertDataSchema(name, now, schemas, format)
    } catch (error) {
        console.log(error)
    }
}

const deleteSchema = async (name) => {
    try {
        await connectDB();
        let res =await deleteSchemaByName(name)
        return res;
    } catch (error) {
        console.log(error);
    }
}
export {getFieldNameList, getSchema, addSchemas, getSchemaList,deleteSchema}
