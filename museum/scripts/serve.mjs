import http from 'node:http';
import { createReadStream, realpathSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=realpathSync(fileURLToPath(new URL('../dist',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.mp4':'video/mp4','.woff2':'font/woff2','.ico':'image/x-icon'};
export const server=http.createServer((req,res)=>{
 const end=(n,msg)=>{res.writeHead(n,{'Content-Type':'text/plain; charset=utf-8'});res.end(msg)};
 if(!['GET','HEAD'].includes(req.method)){res.setHeader('Allow','GET, HEAD');return end(405,'Method not allowed')}
 let name;try{name=decodeURIComponent(req.url.split('?')[0])}catch{return end(400,'Invalid URL')}
 if(name==='/healthz')return end(200,'ok');
 if(name.split('/').some(x=>x.startsWith('.'))||name.includes('\\'))return end(404,'Not found');
 let file,st;try{file=path.resolve(root,'.'+name);if(statSync(file).isDirectory())file=path.join(file,'index.html');file=realpathSync(file);if(!file.startsWith(root+path.sep))return end(404,'Not found');st=statSync(file);if(!st.isFile())throw Error()}catch{return end(404,'Not found')}
 const tag='"'+st.size+'-'+Math.trunc(st.mtimeMs)+'"';const ext=path.extname(file);
 res.setHeader('ETag',tag);res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Content-Type',types[ext]||'application/octet-stream');res.setHeader('Cache-Control',['.html','.json','.js','.css'].includes(ext)?'no-cache':'public, max-age=86400');res.setHeader('Accept-Ranges','bytes');
 if(req.headers['if-none-match']===tag){res.writeHead(304);return res.end()}
 let start=0,endByte=st.size-1,status=200;
 if(req.headers.range){const m=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);if(!m||(!m[1]&&!m[2])){res.setHeader('Content-Range','bytes */'+st.size);return end(416,'Invalid range')}
  start=m[1]?Number(m[1]):Math.max(0,st.size-Number(m[2]));endByte=m[1]&&m[2]?Math.min(Number(m[2]),st.size-1):st.size-1;
  if(start>endByte||start>=st.size){res.setHeader('Content-Range','bytes */'+st.size);return end(416,'Invalid range')}status=206;res.setHeader('Content-Range',`bytes ${start}-${endByte}/${st.size}`)}
 res.setHeader('Content-Length',endByte-start+1);res.writeHead(status);if(req.method==='HEAD')return res.end();const stream=createReadStream(file,{start,end:endByte});stream.on('error',()=>res.destroy());stream.pipe(res);
});
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){server.listen(Number(process.env.PORT||3000),'0.0.0.0',()=>console.log('Museum listening'));process.on('SIGTERM',()=>server.close())}
