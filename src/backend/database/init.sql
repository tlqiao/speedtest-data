-- 创建 uploaded_datasets 表
CREATE TABLE uploaded_datasets (
                                   id SERIAL PRIMARY KEY,
                                   dataset_name VARCHAR(255) NOT NULL,
                                   file_name VARCHAR(255) NOT NULL,
                                   upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建 dataset_values 表
CREATE TABLE dataset_values (
                                id SERIAL PRIMARY KEY,
                                dataset_id INT NOT NULL REFERENCES uploaded_datasets(id),
                                column_name VARCHAR(255) NOT NULL,
                                row_index INT NOT NULL,
                                value TEXT,
                                CONSTRAINT unique_column_row_per_dataset UNIQUE (dataset_id, column_name, row_index)
);
