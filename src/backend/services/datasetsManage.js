import CrudDatasets from '../database/crudDatasets.js'
import {PostgresDatabase} from '../database/base.js'
import {parse} from 'csv-parse/sync';

const withDatabase = async (fn) => {
    const db = new PostgresDatabase();
    await db.connect();
    try {
        const crudDatasets = new CrudDatasets(db);
        await fn(crudDatasets);
    } catch (error) {
        console.error('Error during database operation:', error);
    }
};

const uploadCsv = async (datasetName, fileName, csvContent) => {
    await withDatabase(async (crudDatasets) => {
        const datasetResult = await crudDatasets.insertDataset(datasetName, fileName);
        const datasetId = datasetResult.rows[0].id;
        const records = parse(csvContent, {
            columns: true,
            skip_empty_lines: true
        });

        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            for (const columnName in record) {
                if (record.hasOwnProperty(columnName)) {
                    const value = record[columnName];
                    await crudDatasets.insertDatasetValue(datasetId, columnName, i + 1, value);
                }
            }
        }
        console.log('CSV data uploaded successfully');
    });
};

const getDatasetList = async () => {
    let datasetList = [];
    await withDatabase(async (crudDatasets) => {
        const result = await crudDatasets.queryDatasets();
        datasetList = result.rows.map((item, index) => ({
            key: (index + 1).toString(),
            name: item.dataset_name,
            fileName: item.file_name,
            updateTime: item.upload_time,
        }))

    });
    return datasetList;

}

const deleteDataset = async (name) => {
    await withDatabase(async (crudDatasets) => {
        await crudDatasets.deleteDatasetsByName(name);
    })
}

const processDatasetValue = async( name) => {
    let orgData = [];
    await withDatabase(async (crudDataset) => {
        orgData = await crudDataset.queryDatasetValues(name);
    })
    const columnNames = [...new Set(orgData.map(row => row.column_name))];
    const rowIndices = [...new Set(orgData.map(row => row.row_index))];
    const data = rowIndices.map(rowIndex => {
        const row = { row_index: rowIndex };
        columnNames.forEach(columnName => {
            const cell = orgData.find(row => row.row_index === rowIndex && row.column_name === columnName);
            row[columnName] = cell ? cell.value : '';
        });
        return row;
    });
    return data;
}

export {uploadCsv, getDatasetList, deleteDataset,processDatasetValue}
