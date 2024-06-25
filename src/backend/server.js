import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import genSqlRouter from '../backend/api/genSql.js';
import genDataRouter from '../backend/api/genData.js'



const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(genSqlRouter);
app.use(genDataRouter);


app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
});
