// 如果是在 Node.js 环境（v17 或更低），需先安装 node-fetch：
// npm install node-fetch
// import fetch from 'node-fetch'; // Node.js 环境
// 或直接使用原生 fetch（Node.js v18+ 或浏览器环境）：
const fetch = globalThis.fetch;
const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');

// 飞书应用配置
const APP_ID = 'cli_a8b702a851f8d00e';
const APP_SECRET = 'vL8SmMABJ0f6gOTTtegkceufjFWOZa1W';
const SPREADSHEET_TOKEN = 'KO6OsdP4MhcjSJtYTnccdk0Nnic';
const SHEET_ID = 'l1Pc8C';

const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTE0NzIwMDAwMDAsInN1YiI6IjU2OTgxOTMyOTcifQ.Fv0drHLjr75IQcEVIAVxC2sCff9AtnuhDtHAhuTpN3g";

// 获取 tenant_access_token
async function getTenantAccessToken() {
  // const url = 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal';
  // const response = await fetch(url, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET }),
  // });
  // const data = await response.json();
  // return data.tenant_access_token;
return "u-e9bBEonmd6kHxosYA7MIPGg56rAk04wVNww01hc006x4";
}

// 读取表格数据
async function getSheetData(token) {
  const range = `${SHEET_ID}!A2:D30`;
  const url = `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${SPREADSHEET_TOKEN}/values/${range}`;
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  return data.data.valueRange.values;
}

// 获取单元格背景色
// async function getCellStyle(token, row, col) {
//   const url = `https://open.feishu.cn/open-apis/sheets/v2/spreadsheets/${SPREADSHEET_TOKEN}/styles/${SHEET_ID}!${col}${row}`;
//   const response = await fetch(url, {
//     headers: { 'Authorization': `Bearer ${token}` },
//   });
//   const data = await response.json();
//   return data.data.style;
// }


function formatFeishuDate(value) {
  if (!value) return null;

  // 情况1：已经是字符串格式（如 "2023-11-20"）
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  // 情况2：数字格式（如 45256，需转换）
  if (typeof value === 'number') {
    const date = new Date(1899, 11, 31 + value); // Excel 基准日期（1899-12-30）
    return date.toISOString().split('T')[0]; // 转成 YYYY-MM-DD
  }

  return null;
}

// 主逻辑
async function checkRedCellsWithTodayDate() {
  try {
    const token = await getTenantAccessToken();
    const values = await getSheetData(token);
    // const today = "2025-06-04";
    const today = new Date().toISOString().split('T')[0];
    const result = [];

    for (let i = 0; i < values.length; i++) {
      const row = i ;
      const cellValue = values[i][0];

      const cellDate = formatFeishuDate(cellValue);
      if(!!!cellDate){
        break;
        // continue;
      }
      if (cellDate === today) { // 比对是否为今天
       
          result.push(values[i]);
        // }
      }
    }

    console.log('符合条件的行：', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}
// Helper function to download an image
function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    // Create directory if it doesn't exist
    const destDir = path.dirname(dest);
    fs.mkdir(destDir, { recursive: true })
      .then(() => {
        // Select http or https module based on URL
        const client = url.startsWith('https') ? https : http;
        
        const request = client.get(url, (response) => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            return reject(new Error(`Failed to download image: ${response.statusCode}`));
          }

          const file = fs.open(dest, 'w')
            .then(fileHandle => {
              const stream = fileHandle.createWriteStream();
              response.pipe(stream);
              
              stream.on('finish', () => {
                stream.close();
                resolve();
              });
              
              stream.on('error', err => {
                reject(err);
              });
            })
            .catch(err => reject(err));
        });
        
        request.on('error', err => {
          reject(err);
        });
      })
      .catch(err => reject(err));
  });
}

function getCurrentDateTime() {
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以要+1
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

const BASE_URL = 'https://api-scenter.inbeidou.cn/agent/v1';

async function getNovelInfos(infos){
  const results = [];
    
    // 循环处理每个third_serial_id
    for (const info of infos) {
      const third_serial_id = info[2];
      // 第一步：获取任务列表
      const taskListUrl = `${BASE_URL}/task/page?task_type=2&page_num=1&page_size=15&app_id=&third_serial_id=${third_serial_id}`;
      const taskResponse = await fetch(taskListUrl);
      const taskData = await taskResponse.json();
      
      if (taskData.code !== 0 || !taskData.body.data || taskData.body.data.length === 0) {
        console.log(`没有找到third_serial_id为${third_serial_id}的任务`);
        continue;
      }
      
      // 处理每个任务
      for (const task of taskData.body.data) {
        const { 
          task_id, 
          app_id, 
          title, 
          tag, 
          cover, 
          episode_count, 
          serial_id ,
          description
        } = task;
        
        // 第二步：获取每集内容
        let episodes = [];
        for (let episode_order = 1; episode_order <= episode_count; episode_order++) {
          const episodeUrl = `${BASE_URL}/episode/info?serial_id=${serial_id}&episode_order=${episode_order}&need_play=1&app_id=${app_id}&task_type=2`;
          const episodeResponse = await fetch(episodeUrl,{
            headers: {
              'authorization': authorization,
              'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
              'referer':'https://creator.inbeidou.cn/',
              'host':'api-scenter.inbeidou.cn',
              'origin':'https://creator.inbeidou.cn'
            },
          });
          const episodeData = await episodeResponse.json();
          
          if (episodeData.code === 0) {
            episodes.push({
              number:episode_order,
              content: episodeData.body.chapter_content
            });
          }
          await delay(1000); // 等待1秒
        }

         
          let novelContent = description;
          episodes[0].content = episodes[0].content.replace(novelContent,'')

        

        
        // 第三步：提交任务获取code
        const receiveUrl = `${BASE_URL}/task/receive`;
        const receiveResponse = await fetch(receiveUrl, {
          method: 'POST',
          headers: {
            'content-type':'application/json',
            'authorization': authorization,
              'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
              'referer':'https://creator.inbeidou.cn/',
              'host':'api-scenter.inbeidou.cn',
              'origin':'https://creator.inbeidou.cn'
          },
          body: JSON.stringify({
            task_id:task_id,
            task_type: 2,
            platform: 1
          })
        });
        const receiveData = await receiveResponse.json();
        const code = receiveData.code === 0 ? receiveData.body.code : null;
        
        // 组装结果对象
        results.push({
          task_id,
          app_id,
          title,
          tag,
          cover,
          episode_count,
          serial_id,
          episodes,
          code,
          novelContent
        });
      }
    }
    // console.log('最终结果:', JSON.stringify(results, null, 2));
    return results;
}

// 执行
async function main(){
  const infos = await checkRedCellsWithTodayDate();
  try {
    const novels = await getNovelInfos(infos);
    const novelsDir = path.join(__dirname, '..', '_novels');
    
    
    for(const novel of novels){

      const title = novel.title.trim();
      const coverUrl = 'https://play.inbeidou.cn'+(novel?.cover?.trim() || '');
      const token = novel?.code.trim() || '';

      
      

      // Find the largest novel ID
      let maxNovelId = 0;
      const novelDirs = await fs.readdir(novelsDir);
        
      try{

        for (const dir of novelDirs) {
          if (/^\d+$/.test(dir)) {
            const filePath = path.join(novelsDir, dir+'.md');
            const fileContent = await fs.readFile(filePath, 'utf8');
            const titleMatch = fileContent.match(/title:\s*"([^"]+)"/);
            if (titleMatch && titleMatch[1] === title) {
              console.error('Title Exist:'+titleMatch[1]);
              throw new Error('title exists');
            }
            const id = parseInt(dir, 10);
            if (id > maxNovelId) maxNovelId = id;
          }
        }
      }catch(e){
        continue;
      }
      
      
      // New novel ID
      const novelId = maxNovelId + 1;
      const novelDirPath = path.join(novelsDir, novelId.toString());
      
      // Create directory structure if it doesn't exist
      try {
        // await fs.mkdir(novelsDir, { recursive: true });
        await fs.mkdir(novelDirPath, { recursive: true });
      } catch (err) {
        console.log(`Error creating directories: ${err.message}`);
      }
      
      // Download cover image if URL is provided
      let coverImagePath = "";
      const formattitle = title.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
      if (coverUrl) {
        // Create image filename
        const imageFilename = `${formattitle}.jpeg`;  
        const imageDestPath = path.join(__dirname, '..', 'images', imageFilename);
        
        try {
          await downloadImage(coverUrl, imageDestPath);
          console.log(`Downloaded cover image to ${imageDestPath}`);
          coverImagePath = `/images/${imageFilename}`;
        } catch (err) {
          console.error(`Failed to download cover image: ${err.message}`);
          coverImagePath = `/images/${formattitle}.jpeg`;
        }
      } else {
        coverImagePath = `/images/novelmaster.jpeg`;
      }

      //  Create cover file (1.md)
    const coverContent = `---
layout: novel
title: "${title}"
author: ""
featured: true
views: ${Math.floor(Math.random() * 1000)}
cover_image: "${coverImagePath}"
genre: "Realistic"
last_updated: "${getCurrentDateTime()}"
rating: ${(Math.random() * (5 - 4) + 4).toFixed(1)}
rating_count: ${Math.floor(Math.random() * 100)}
---

${novel.novelContent || ''}
`;

    await fs.writeFile(path.join(novelsDir, `${novelId}.md`), coverContent);
    
    const chapters = novel.episodes||[];
    // Create chapter files
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      const prevChapter = i > 0 ? `/novels/${novelId}/${i}/` : "";
      const nextChapter = i < chapters.length - 1 ? `/novels/${novelId}/${i+2}/` : "";
      
      const chapterContent = `---
layout: chapter
title: "Chapter ${chapter.number}"
novel_index: "/novels/${novelId}/"
chapter_number: ${chapter.number}
next_chapter: "${nextChapter?nextChapter:`/novels/${novelId}/more/`}"
previous_chapter: "${prevChapter}"
---

${chapter.content}`;

      await fs.writeFile(path.join(novelDirPath, `${chapter.number}.md`), chapterContent);
    }

    const moreContent = `---
layout: more
title: "${title}"
novel_index: "/novels/${novelId}/"
previous_chapter: "/novels/${novelId}/${chapters.length}/"
token: ${token}
appname: "RealNovel"
---

`

    await fs.writeFile(path.join(novelDirPath, `more.md`), moreContent);

    
    console.log(`Successfully processed novel "${title}" with ID ${novelId}`);
    console.log(`Created ${chapters.length} chapter files`);

    }
    
    

    return novels;
    
  } catch (error) {
    console.error('处理过程中出错:', error);
    throw error;
  }
}

main().catch(console.error);
