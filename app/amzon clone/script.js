// Elements
const postTitle=document.getElementById('postTitle');
const postCategory=document.getElementById('postCategory');
const postTags=document.getElementById('postTags');
const postContent=document.getElementById('postContent');
const postImage=document.getElementById('postImage');
const dropArea=document.getElementById('dropArea');
const publishBtn=document.getElementById('publishBtn');
const previewContent=document.getElementById('previewContent');
const postsContainer=document.getElementById('postsContainer');
const searchInput=document.getElementById('search');
const categoryFilter=document.getElementById('categoryFilter');
const sortOrder=document.getElementById('sortOrder');
const themeToggle=document.getElementById('themeToggle');
const totalPosts=document.getElementById('totalPosts');
const totalCats=document.getElementById('totalCats');
const totalTags=document.getElementById('totalTags');
const paginationContainer=document.getElementById('pagination');
const exportBtn=document.getElementById('exportBtn');
const importBtn=document.getElementById('importBtn');
const importFile=document.getElementById('importFile');
const categoryChartCanvas=document.getElementById('categoryChart');
const tagChartCanvas=document.getElementById('tagChart');

let posts=JSON.parse(localStorage.getItem('ultimatePosts'))||[];
const POSTS_PER_PAGE=5;
let currentPage=1;

// Theme toggle
themeToggle.addEventListener('click',()=>{
  document.body.classList.toggle('dark-mode');
  themeToggle.textContent=document.body.classList.contains('dark-mode')?'☀️ Light Mode':'🌙 Dark Mode';
});

// Live Markdown Preview with syntax highlight
postContent.addEventListener('input',()=>{
  previewContent.innerHTML=marked.parse(postContent.value);
  previewContent.querySelectorAll('pre code').forEach((block)=>{hljs.highlightBlock(block);});
});

// Drag & Drop Image
dropArea.addEventListener('click',()=>postImage.click());
dropArea.addEventListener('dragover',(e)=>{e.preventDefault(); dropArea.style.borderColor='blue';});
dropArea.addEventListener('dragleave',(e)=>{e.preventDefault(); dropArea.style.borderColor='#ccc';});
dropArea.addEventListener('drop',(e)=>{
  e.preventDefault();
  const file=e.dataTransfer.files[0];
  if(file) postImage.files= e.dataTransfer.files;
  dropArea.style.borderColor='#ccc';
});

// Save posts
function savePosts(){localStorage.setItem('ultimatePosts',JSON.stringify(posts));}

// Render posts
function renderPosts(){
  let filtered=posts.filter(p=>{
    const searchText=searchInput.value.toLowerCase();
    const catText=categoryFilter.value.toLowerCase();
    return (p.title.toLowerCase().includes(searchText) ||
            p.tags.join(',').toLowerCase().includes(searchText)) &&
           (catText==='all' || p.category.toLowerCase()===catText);
  });

  filtered.sort((a,b)=>sortOrder.value==='newest'?b.date-a.date:a.date-b.date);

  const totalPages=Math.ceil(filtered.length/POSTS_PER_PAGE);
  const start=(currentPage-1)*POSTS_PER_PAGE;
  const end=start+POSTS_PER_PAGE;
  const pagePosts=filtered.slice(start,end);

  postsContainer.innerHTML='';
  pagePosts.forEach((post,index)=>{
    const postEl=document.createElement('div');
    postEl.className='post';
    postEl.innerHTML=`
      <h3>${post.title}</h3>
      <div class="category">Category: ${post.category}</div>
      <div class="tags">Tags: ${post.tags.join(', ')}</div>
      ${post.image?`<img src="${post.image}">`:''}
      <div class="content">${marked.parse(post.content)}</div>
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    `;
    postEl.querySelector('.edit').addEventListener('click',()=>{
      postTitle.value=post.title;
      postCategory.value=post.category;
      postTags.value=post.tags.join(',');
      postContent.value=post.content;
      if(post.image) dropArea.textContent="Image selected (edit will remove it)";
      posts.splice(posts.indexOf(post),1);
      savePosts();
      renderPosts();
    });
    postEl.querySelector('.delete').addEventListener('click',()=>{
      posts.splice(posts.indexOf(post),1);
      savePosts();
      renderPosts();
    });
    postsContainer.appendChild(postEl);
  });

  renderPagination(totalPages);
  renderAnalytics();
  updateDashboard();
  updateCategoryFilter();
}

// Publish post
publishBtn.addEventListener('click',()=>{
  const title=postTitle.value.trim();
  const category=postCategory.value.trim()||'Uncategorized';
  const tags=postTags.value.split(',').map(t=>t.trim()).filter(t=>t);
  const content=postContent.value.trim();
  if(!title || !content) return alert('Title and content required!');

  const reader=new FileReader();
  reader.onload=()=>{
    posts.push({title,category,tags,content,image:reader.result,date:Date.now()});
    savePosts();
    renderPosts();
    clearForm();
  };
  if(postImage.files[0]) reader.readAsDataURL(postImage.files[0]);
  else{
    posts.push({title,category,tags,content,image:null,date:Date.now()});
    savePosts();
    renderPosts();
    clearForm();
  }
});

function clearForm(){postTitle.value='';postCategory.value='';postTags.value='';postContent.value='';postImage.value='';dropArea.textContent='Drag & Drop Image Here'; previewContent.innerHTML='';}

// Search, filter, sort
searchInput.addEventListener('input',()=>{currentPage=1; renderPosts();});
categoryFilter.addEventListener('change',()=>{currentPage=1; renderPosts();});
sortOrder.addEventListener('change',()=>{currentPage=1; renderPosts();});

// Pagination
function renderPagination(totalPages){
  paginationContainer.innerHTML='';
  for(let i=1;i<=totalPages;i++){
    const btn=document.createElement('button');
    btn.textContent=i;
    if(i===currentPage) btn.style.fontWeight='bold';
    btn.addEventListener('click',()=>{currentPage=i; renderPosts();});
    paginationContainer.appendChild(btn);
  }
}

// Dashboard
function updateDashboard(){
  totalPosts.textContent=posts.length;
  totalCats.textContent=[...new Set(posts.map(p=>p.category))].length;
  totalTags.textContent=[...new Set(posts.flatMap(p=>p.tags))].length;
}

// Categories filter
function updateCategoryFilter(){
  const categories=[...new Set(posts.map(p=>p.category))];
  categoryFilter.innerHTML='<option value="all">All Categories</option>'+categories.map(c=>`<option value="${c}">${c}</option>`).join('');
}

// Analytics Charts
let categoryChart=null;
let tagChart=null;
function renderAnalytics(){
  const catData={};
  const tagData={};
  posts.forEach(p=>{
    catData[p.category]=(catData[p.category]||0)+1;
    p.tags.forEach(t=>tagData[t]=(tagData[t]||0)+1);
  });
  const catLabels=Object.keys(catData);
  const catValues=Object.values(catData);
  const tagLabels=Object.keys(tagData);
  const tagValues=Object.values(tagData);

  if(categoryChart) categoryChart.destroy();
  if(tagChart) tagChart.destroy();

  categoryChart=new Chart(categoryChartCanvas,{
    type:'bar',
    data:{labels:catLabels,datasets:[{label:'Posts per Category',data:catValues,backgroundColor:'#4caf50'}]},
    options:{responsive:true,plugins:{legend:{display:false}}}
  });

  tagChart=new Chart(tagChartCanvas,{
    type:'bar',
    data:{labels:tagLabels,datasets:[{label:'Posts per Tag',data:tagValues,backgroundColor:'#ff9800'}]},
    options:{responsive:true,plugins:{legend:{display:false}}}
  });
}

// Export / Import
exportBtn.addEventListener('click',()=>{
  const dataStr="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(posts));
  const dlAnchor=document.createElement('a');
  dlAnchor.setAttribute('href',dataStr);
  dlAnchor.setAttribute('download','posts_backup.json');
  dlAnchor.click();
});

importBtn.addEventListener('click',()=>importFile.click());
importFile.addEventListener('change',(e)=>{
  const file=e.target.files[0];
  const reader=new FileReader();
  reader.onload=()=>{posts=JSON.parse(reader.result); savePosts(); renderPosts();}
  reader.readAsText(file);
});

// Initial render
renderPosts();



