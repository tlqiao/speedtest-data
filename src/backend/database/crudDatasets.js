class CrudDatasets {
    constructor(db) {
        this.db = db;
    }

    async insertDataset(datasetName, fileName) {
        try {
            const query = `
                INSERT INTO uploaded_datasets (dataset_name, file_name)
                VALUES ($1, $2) RETURNING id;
            `;
            const values = [datasetName, fileName];
            const result = await this.db.client.query(query, values);
            return result;
            console.log('Dataset inserted with ID:', result.rows[0].id);
        } catch (err) {
            console.error('Error inserting dataset:', err);
        }
    }

    async queryDatasets() {
        try {
            const query = `SELECT *
                           FROM uploaded_datasets `
            const result = await this.db.client.query(query);
            return result;
            console.log('Query result:', result.rows);
        } catch (err) {
            console.error('Error querying datasets:', err);
        }
    }

    async deleteDatasetsByName(datasetName) {
        try {
            await this.db.client.query('BEGIN');
            let query= `SELECT id FROM uploaded_datasets
                WHERE dataset_name = $1`;
            const idResult = await this.db.client.query(query,[datasetName]);
            if (idResult.rows.length === 0) {
                console.log('Dataset not found');
                await this.db.client.query('ROLLBACK');
                return;
            }
            const id = idResult.rows[0].id;
            query= `DELETE FROM dataset_values WHERE dataset_id=$1`;
            await this.db.client.query(query,[id]);
            query= `DELETE FROM uploaded_datasets WHERE id = $1`;
            await this.db.client.query(query,[id]);
            await this.db.client.query('COMMIT');
            console.log('Dataset and associated values deleted successfully');
        } catch (error) {
            await this.db.client.query('ROLLBACK');
            console.error('Error delete datasets: ', error)
        }
    }

    async insertDatasetValue(datasetId, columnName, rowIndex, value) {
        try {
            const query = `
                INSERT INTO dataset_values (dataset_id, column_name, row_index, value)
                VALUES ($1, $2, $3, $4);
            `;
            const values = [datasetId, columnName, rowIndex, value];
            const result = await this.db.client.query(query, values);
            return result;
            console.log('Dataset value inserted successfully');
        } catch (err) {
            console.error('Error inserting dataset value:', err);
        }
    }

    async queryDatasetValues(datasetName) {
        try {
            let query= `SELECT id FROM uploaded_datasets
                WHERE dataset_name = $1`;
            const idResult = await this.db.client.query(query,[datasetName]);
            if (idResult.rows.length === 0) {
                console.log('Dataset not found');
                await this.db.client.query('ROLLBACK');
                return;
            }
            const id = idResult.rows[0].id;
            query= `SELECT column_name, row_index, value FROM dataset_values WHERE dataset_id = $1 ORDER BY row_index, column_name`;
            const result = await this.db.client.query(query,[id]);
            if (result.rows.length === 0) {
                console.log(`No values found for dataset with ID ${id}.`);
                return;
            }
            return result.rows;
        } catch (err) {
            console.error('Error querying dataset values:', err);
        }
    }
}

export default CrudDatasets;
