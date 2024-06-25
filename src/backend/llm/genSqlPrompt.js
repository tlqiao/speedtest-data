import {ChatPromptTemplate} from "@langchain/core/prompts";

export const genSQLPrompt=ChatPromptTemplate.fromMessages([
    ["system","You are a sql expert, write sql base on given sql tables and user request."],
    ["user","Your task is write sql base on given sql tables and request\n" +
    "```{tableSchemas}```\n" +
    "\n" +
    "```{naturalSql}```" +
    "Only generate sql, do not generate any explanation"
    ]
])

export const genSQLCodePrompt = ChatPromptTemplate.fromMessages([
    ["system","you are {language} and {clientTool} expert, write code to get the data with {clientTool} base on given sql."],
    ["user","Your task is writing code with {language} and {clientTool} base on below given table sql and user_request\n" +
    "```{sql}```\n" +
    "Only generate code, do not generate any explanation"
    ]
])
