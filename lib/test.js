const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');

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

// 输出当前时间
console.log(getCurrentDateTime());

function transToInt(line){
  let str = "";
  if(/^[0-9]+$/.test(line)){
    str = line;
  }else if(/^[0-9]+\.$/.test(line)){
    const match = line.match(/^([0-9]+)\.$/);
    str = match[1];
  }else if(/^Chapter\s+.+$/i.test(line)){
    
    const match = line.match(/^Chapter\s+(.+)$/i);
    str = match[1];
  }
  let num = parseInt(str, 10);
  if(!!!num){
    throw new Error("Chapter Num Error:"+str);
  }
  return parseInt(str, 10);
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

async function processNovel() {
  try {
    // Read the text file
    const content = await fs.readFile(path.join(__dirname, 'text.txt'), 'utf8');
    const lines = content.split('\n');
    
    // Extract title (first line) and cover image URL (second line)
    const title = lines[0].trim();
    const coverUrl = lines[1]?.trim() || '';
    const token = lines[2]?.trim() || '';
    
    // Find the largest novel ID
    const novelsDir = path.join(__dirname, '..', '_novels');
    let maxNovelId = 0;
    
   
      const novelDirs = await fs.readdir(novelsDir);
      for (const dir of novelDirs) {
        if (/^\d+$/.test(dir)) {
          const filePath = path.join(novelsDir, dir+'.md');
          const fileContent = await fs.readFile(filePath, 'utf8');
          const titleMatch = fileContent.match(/title:\s*"([^"]+)"/);
          if (titleMatch && titleMatch[1] === title) {
            throw new Error('Title Exist:'+titleMatch[1]);
          }
          const id = parseInt(dir, 10);
          if (id > maxNovelId) maxNovelId = id;
        }
      }
    
    
    // New novel ID
    const novelId = maxNovelId + 1;
    const novelDirPath = path.join(novelsDir, novelId.toString());
    
   
    
    // Process chapters
    let novelContent = [];
    let isContent = true;
    let chapters = [];
    let currentChapter = null;
    let chapterContent = [];
    
    for (let i = 3; i < lines.length; i++) {
      const line = lines[i].trim();
      
      
      // Check if it's a chapter marker (just a number)
      if (/^[0-9]+$/.test(line)||/^Chapter\s+.+$/i.test(line)) {
        isContent = false;
        // Save previous chapter if exists
        if (currentChapter !== null) {
          chapters.push({
            number: currentChapter,
            content: chapterContent.join('\n\n')
          });
          chapterContent = [];
        }
        currentChapter = transToInt(line);
      } else if (currentChapter !== null && line !== '') {
        // Add non-empty lines to current chapter
        chapterContent.push(line);
      }

      if(!!line&&isContent){
        novelContent.push(line);
      }
    }
    
    // Add the last chapter
    if (currentChapter !== null && chapterContent.length > 0) {
      chapters.push({
        number: currentChapter,
        content: chapterContent.join('\n\n')
      });
    }

    // Create directory structure if it doesn't exist
    try {
      await fs.mkdir(novelsDir, { recursive: true });
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
    
    // Create cover file (1.md)
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

${novelContent?.join('\n\n') || ''}
`;

    await fs.writeFile(path.join(novelsDir, `${novelId}.md`), coverContent);
    
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
---

`

    await fs.writeFile(path.join(novelDirPath, `more.md`), moreContent);

    
    console.log(`Successfully processed novel "${title}" with ID ${novelId}`);
    console.log(`Created ${chapters.length} chapter files`);
    
  } catch (err) {
    console.error('Error processing novel:', err);
  }
}

processNovel();