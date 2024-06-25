import {ChatPromptTemplate} from "@langchain/core/prompts";

const prompt = "Generate a {fileType} format data with {lines} lines by following these steps:\n" +
"1.Analyze below dataType list, which contains a JSON object with keys: name, type, and options. The name represents the data header name, the type signifies the data type, and the options include rules for generating data, such as the percentage of blanks.\n"+
"If you encounter unfamiliar values in the options key, refer to the following rules:\n" +

"'blank': x% indicates that x% of the generated data should be null.\n"+
"'mean': x specifies that the mean value of the generated data must be x.\n"+

"dataTypes List:\n{dataTypes}" +

"2.Create {fileType} format data based on the dataTypes list, ensuring that the data lines match the specified {lines} count.\n"+
"3.Include the data header name in the data file, which should correspond to the names provided in the dataTypes list.\n"+
"4.Please generate only test data without any additional explanations"

export const genDataWithHeaderPrompt=ChatPromptTemplate.fromMessages([
    ["system","you are data generate expert, you can generate data base on given data type"],
    ["user",prompt]])
