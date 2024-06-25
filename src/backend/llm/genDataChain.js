import {initModel} from './initModel.js'
import {StringOutputParser} from "@langchain/core/output_parsers";
import {genDataWithHeaderPrompt} from './genDataPrompt.js'


export async function genFakeData(model,fileType,lines,dataTypes) {
    const outputParser = new StringOutputParser();
    let chain;
        chain = genDataWithHeaderPrompt.pipe(initModel(model)).pipe(outputParser)
    console.log(JSON.stringify(dataTypes));
    let result = await chain.invoke(
        {
            fileType: fileType,
            lines: lines,
            dataTypes: JSON.stringify(dataTypes)
        }
    )
    return result
}



