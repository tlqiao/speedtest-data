import {initModel} from './initModel.js'
import {StringOutputParser} from "@langchain/core/output_parsers";
import {genSQLPrompt,genSQLCodePrompt} from "./genSqlPrompt.js"

export async function genSQL(model,tableSchemas,naturalSql) {
    const outputParser = new StringOutputParser();
    let chain;
        chain = genSQLPrompt.pipe(initModel(model)).pipe(outputParser)
    let result = await chain.stream(
        {
            tableSchemas: tableSchemas,
            naturalSql: naturalSql
        }
    )
    return result
}

export async function genSQLCode(model,sql,language,clientTool){
    const outputParser = new StringOutputParser();
    let chain;
    chain = genSQLCodePrompt.pipe(initModel(model)).pipe(outputParser)
    let result = await chain.stream(
        {
            sql: sql,
            language:language,
            clientTool:clientTool
        }
    )
    return result
}
