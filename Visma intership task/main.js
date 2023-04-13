import { testData, sortParam } from "./data.js"

document.querySelector('.demo').addEventListener('click', ()=>{
  sessionStorage.setItem('task', JSON.stringify(testData));
  sessionStorage.setItem('sort', JSON.stringify(sortParam));
  displayData();
})

function addTosessionStorage () {
  const description = document.querySelector('#description');
  const taskDate = document.querySelector('#deadline-date');
  const sStorage = JSON.parse(sessionStorage.getItem('task'));

  const arr = {
    data:{
      'value':description.value,
      'date':taskDate.value ?? '', 
      'status':0,
      'id':genID()
        },
  }
  const array = []
  if (sStorage == null) {
    array.push(arr);
    sessionStorage.setItem('task', JSON.stringify(array));
  }
  sStorage.push(arr)
  sessionStorage.setItem('task', JSON.stringify(sStorage));
  sessionStorage.setItem('sort', JSON.stringify({'value':'status', 'direction':'asc'}));
}

const button = document.querySelector('#addTask');
button.addEventListener('click', () => {
  const description = document.querySelector('#description');
  if(description.value){
    addTosessionStorage();
  }
})

function displayData () {
  const taskContainer = document.querySelector('.tasks-container')
  const tasks = sort(getSessionStorage(), JSON.parse(sessionStorage.getItem('sort')));
  let taskDiv = ''
  tasks.forEach(function callback(task, index) {
    let isChecked = task.data.status == 1? 'checked': ''
    taskDiv += `<div class="task ${task.data.status == 1? 'completed-task':''}" task-id="${task.data.id ?? ''}" >
                  <div class="task-holder">
                    <div>
                      <p class="${task.data.status == 1? 'line-through':''}">
                        ${task.data.value ?? ''}
                      </p>
                    </div>
                    <div>
                      <p class="${task.data.status == 1? 'line-through':''}">
                        ${task.data.date ? (new Date(task.data.date)).toLocaleString(): ''}
                      </p>
                    </div>
                  </div>
                  <div class="task-actions">
                    <div class="checkbox">
                      <lable for="compleated">Completed</lable>
                      <input type="checkbox" ${isChecked} id="completed">
                    </div>
                      <button class="delete">Delete Task</button>
                    </div>
                  </div>`
  });
  taskContainer.innerHTML = taskDiv
  const taskElements = taskContainer.querySelectorAll('[task-id]');
  taskElements.forEach(node => {
    const delBtn = node.querySelector('.delete');
    const check = node.querySelector('#completed');
    check.addEventListener('change', (e) =>{
      if(e.target.checked){
        completTask(node.getAttribute('task-id'));
      }else{
        continueTask(node.getAttribute('task-id'));
      } 
      displayData();    
    })
    delBtn.addEventListener('click', (e) => {
        if(confirm('do u want do delete?')){
      node.remove();
      deleteTask(node.getAttribute('task-id'));
    }
    })
  })
}

function deleteTask (id) {
    const sStorage = getSessionStorage();
    const key = sStorage.findIndex((item)=>{
      return item.data.id == id
    })
    delete sStorage[key]
    updateStorage(sStorage)
}
function completTask (id) {
    const sStorage = getSessionStorage();
    const key = sStorage.findIndex((item)=>{
      return item.data.id == id
    })
    sStorage[key].data.status = 1;
    updateStorage(sStorage)
}
function continueTask (id) {
  const sStorage = getSessionStorage();
  const key = sStorage.findIndex((item)=>{
    return item.data.id == id
  })
  sStorage[key].data.status = 0;
  updateStorage(sStorage);
}
function sort(data, sort){
  if(sort.value == 'date'){
    data.sort((a,b)=>{
      return new Date(a.data[sort.value]) - new Date(b.data[sort.value]);
    })
  }else if(sort.direction == 'asc'){
    data = Array.from(data);
    data.sort((a, b)=>{
     return a.data[sort.value] - b.data[sort.value]  
    })
  }else{
    data = Array.from(data);
    data.sort((a, b)=>{
     return b.data[sort.value] - a.data[sort.value]  
    })
  }
  return data
  }

  function genID(){
    return Math.floor(Math.random() * 10000000)
  };
  function getSessionStorage(){
    return JSON.parse(sessionStorage.getItem('task'))
  };

  function updateStorage(data){
    const result = Object.values(data);
    sessionStorage.setItem('task',JSON.stringify(result));
  };

  document.querySelector('.rec-completed').addEventListener('click', ()=>{
    sessionStorage.setItem('sort', JSON.stringify({'value':'status', 'direction':'dsc'}))
    displayData();
  })
  document.querySelector('.default-filter').addEventListener('click', ()=>{
    sessionStorage.setItem('sort', JSON.stringify({'value':'status', 'direction':'asc'}))
    displayData();
  })
  document.querySelector('.deadline-filter').addEventListener('click', ()=>{
    sessionStorage.setItem('sort', JSON.stringify({'value':'date', 'direction':'asc'}))
    displayData();
  })
displayData();
