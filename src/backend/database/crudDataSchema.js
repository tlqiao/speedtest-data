import mongoose from 'mongoose';

const dataSchema = new mongoose.Schema({
    schema_name: String,
    update_time: Date,
    schemas: Object,
    format: Object,
})
const SchemaModel = mongoose.model('schemas', dataSchema)
const insertDataSchema = async (schemaName,updateTime,schemas,format) => {
    try {
        const existingRecord = await SchemaModel.findOne({schema_name: schemaName});
        if(existingRecord) {
            const updatedRecord = await SchemaModel.findOneAndUpdate(
                { schema_name: schemaName },
                { $set: { schemas, update_time: updateTime, format } },
                { new: true }
            );
            console.log('Schema document updated:', updatedRecord);
        } else {
            const schema = new SchemaModel({schema_name: schemaName, update_time: updateTime, schemas: schemas,format:format});
            await schema.save();
            console.log('Schema document created: ', schema);
        }
    } catch (error) {
        console.error('Error creating schema document:', error);
    }
}

const querySchemas = async (query) => {
    try {
        const result = await SchemaModel.find(query);
        return result
    } catch (error) {
        console.error('Error querying schemas:', error);
    }
};

const deleteSchemaByName = async (schemaName) => {
    try {
        const result = await SchemaModel.findOneAndDelete({ schema_name: schemaName });
        return result;
        if (result) {
            console.log('Schema document deleted:', result);
        } else {
            console.log('Schema document not found for deletion');
        }
    } catch (error) {
        console.error('Error deleting schema document:', error);
    }
};

export {insertDataSchema,querySchemas,deleteSchemaByName}
