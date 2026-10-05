import { S3Client, PutObjectCommand, HeadObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const manifest=JSON.parse(await readFile(new URL('../imports/drive-v2/manifest.json',import.meta.url),'utf8'));
for(const name of ['R2_ENDPOINT','R2_BUCKET_NAME','R2_ACCESS_KEY_ID','R2_SECRET_ACCESS_KEY']) if(!process.env[name]) throw new Error(`Missing ${name}`);
const s3=new S3Client({region:'auto',endpoint:process.env.R2_ENDPOINT,credentials:{accessKeyId:process.env.R2_ACCESS_KEY_ID,secretAccessKey:process.env.R2_SECRET_ACCESS_KEY},maxAttempts:3});
const Bucket=process.env.R2_BUCKET_NAME;
const report=[];
for(const file of manifest.files){
 const Body=await readFile(new URL('../V2/'+encodeURIComponent(file.source),import.meta.url));
 if(createHash('sha256').update(Body).digest('hex')!==file.sha256)throw new Error(`Source changed: ${file.source}`);
 let exists=false;
 try { const head=await s3.send(new HeadObjectCommand({Bucket,Key:file.key}));if(head.Metadata?.sha256!==file.sha256 || head.ContentLength!==file.size)throw new Error(`Existing object differs: ${file.key}`);exists=true; }
 catch(e){if(e.$metadata?.httpStatusCode!==404)throw e;}
 if(!exists) await s3.send(new PutObjectCommand({Bucket,Key:file.key,Body,ContentType:file.contentType,CacheControl:'public, max-age=31536000, immutable',Metadata:{sha256:file.sha256},IfNoneMatch:'*'}));
 const got=await s3.send(new GetObjectCommand({Bucket,Key:file.key}));
 const digest=createHash('sha256').update(await got.Body.transformToByteArray()).digest('hex');
 if(digest!==file.sha256)throw new Error(`Readback mismatch: ${file.source}`);
 report.push({source:file.source,key:file.key,verified:true});
 console.log(`${report.length}/${manifest.files.length} verified: ${file.source}`);
}
await writeFile(new URL('../imports/drive-v2/upload-report.json',import.meta.url),JSON.stringify({bucket:Bucket,files:report},null,2));
console.log('All originals uploaded and SHA-256 readback verified.');
