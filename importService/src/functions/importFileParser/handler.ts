import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { S3Event } from "aws-lambda";
import { Readable } from "stream";
import csv from "csv-parser";
import { formatJSONResponse } from "@libs/api-gateway";

import * as dotenv from "dotenv";
dotenv.config();

const processObject = async (client: S3Client, bucketName: string, record: any) => {
    const results = [];
    const objectName = record.s3.object.key;
    const pathToObject = `${bucketName}/${objectName}`;
    const newObjectPath = objectName.replace("uploaded", "parsed");
    const command = { Bucket: bucketName, Key: objectName };
    const copyCommand = { Bucket: bucketName, CopySource: pathToObject, Key: newObjectPath };
    const readableStream = (await client.send(new GetObjectCommand(command))).Body as Readable;

    readableStream
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => {
            console.log("results: ", results);
        });

    await client.send(new CopyObjectCommand(copyCommand));
    await client.send(new DeleteObjectCommand(command));
}


export const importFileParser = async (event: S3Event) => {
    try {
        console.log(`Lambda function 'importFileParser' invoked with event: ${JSON.stringify(event)}`);
        const records = event.Records;
        const bucketName = process.env.S3_BUCKET_NAME;
        const client = new S3Client({ region: process.env.REGION });

        await Promise.all(records.map(record => processObject(client, bucketName, record)));

        return formatJSONResponse({ message: "File successfully parsed and moved to the parsed folder" });
    } catch (error) {
        return formatJSONResponse({ error: error }, 500);
    }
};
