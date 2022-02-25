'use strict'

const inputNewTask = document.getElementById('inputNewTask')
const selectPriority = document.getElementById('selectPriority')
const buttonAddNewTask = document.querySelector('.buttonAdd')
const containerNewTask = document.querySelector('.containerNewTask')
const lowPriorityTasks = document.querySelector('.lowPriority')
const highPriorityTasks = document.querySelector('.highPriority')
let arrTasksLowPriority = []
let arrTasksHighPriority = []

let arrayMyTasks
!localStorage.tasks ? arrayMyTasks = [] : arrayMyTasks = JSON.parse(localStorage.getItem('tasks'))

function Task(description, priority) {
    this.description = description
    this.priority = priority
    this.comleted = false
}

const makeid = () => {
    let text = "";
    let possible = "abcdefghijklmnopqrstuvwxyz";
    for(let i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const createTemplate = (task, index) => {
    const newId = makeid()
    return `
        <div class="itemMyTask">
            <input onclick="completedTask(${index})" type="checkbox" id="${newId}" ${task.comleted ? 'checked' : ''}>
            <label for="${newId}" class="textTask"><span></span>${task.description}</label>
            <div class="buttons">
                <button onclick="editTask(${index})" class="button buttonEdit">&#10000;</button>
                <button onclick="deleteTask(${index})" class="button buttonDelete">&#10005;</button>
            </div>
        </div>
    `
}

const filterTasks = () => {
    arrTasksLowPriority = arrayMyTasks.length && arrayMyTasks.filter(item => item.priority === 'low')
    arrTasksHighPriority = arrayMyTasks.length && arrayMyTasks.filter(item => item.priority === 'high')
}

const fillHtmlList = () => {
    highPriorityTasks.innerHTML = ''
    lowPriorityTasks.innerHTML = ''

    if(arrayMyTasks.length > 0) {
        arrayMyTasks.forEach((item, index) => {

            if(item.priority === 'high') {
                highPriorityTasks.innerHTML += createTemplate(item, index)
                selectPriority.value = ''
            }

            if(item.priority === 'low') {
                lowPriorityTasks.innerHTML += createTemplate(item, index)
                selectPriority.value = ''
            }
        })
    }
}

fillHtmlList()

const updateLocal = () => {
    localStorage.setItem('tasks', JSON.stringify(arrayMyTasks))
}

const completedTask = index => {
    arrayMyTasks[index].comleted = !arrayMyTasks[index].comleted
    updateLocal()
    fillHtmlList()
    filterTasks()
}

const createlWarningMessage = message => {
    return `
        <div class="warningMessage">
            <p><b>${message}</b></p>
        </div>
    `
}

const numberOfError = () => {
    const errors = document.querySelectorAll('.warningMessage')
    return errors.length
}

const deleteError = () => {
    const errors = document.querySelectorAll('.warningMessage')

    if(errors.length > 0) {
        for(let error of errors) {
            error.remove()
        }
    }
}

const fillHtmlError = (point, message) => {
    if(numberOfError() === 0) {
        point.insertAdjacentHTML('beforeend', createlWarningMessage(message))
        const errorMessage = document.querySelector('.warningMessage')
        setTimeout(() => errorMessage.remove(), 2500)
    }
}

const deleteTask = index => {
    arrayMyTasks.splice(index, 1)
    updateLocal()
    fillHtmlList()
    filterTasks()
}

const createTaskChange = (index, task) => {
    return `
    <div class="itemMyTask">
        <input type="text" value="${task}" class="InputForEdit" maxlength="20" autofocus>
        <button onclick="saveEditedTask(${index})" class="button buttonSave">&#43;</button>
    </div>
` 
}

const checkOfRepeat = () => {
    const input = document.querySelector('.InputForEdit')
    let bool
    
        if(isRepeat(input.value)) {
            fillHtmlError(containerNewTask, 'Запись уже есть в списке дел!')
            bool = true
        }
    return bool
}

function saveEditedTask (index) {
    const input = document.querySelector('.InputForEdit')

    if(input.value === arrayMyTasks[index].description) {
        arrayMyTasks[index].description = input.value
        updateLocal()
        fillHtmlList()
        filterTasks()
    }

    else if(checkOfRepeat()) {
        return

    } else {
        arrayMyTasks[index].description = input.value
        updateLocal()
        fillHtmlList()
        filterTasks()
    }
}

const fillHtmlEditTask = index => {
    const arrayLabel = document.querySelectorAll('label')

    for(let item of arrayLabel) {
        if(item.textContent === arrayMyTasks[index].description) {
            const input = createTaskChange(index, item.textContent)
            item.parentElement.innerHTML = input
        }
    }
}

const focusOnInput = index => {
    const input = document.querySelector('.InputForEdit')
    if(input.value === arrayMyTasks[index].description) {
        input.focus()
        const length = input.value ? input.value.length : 0
        input.setSelectionRange(length, length)
    }
}

const editTask = index => {
    fillHtmlEditTask(index)
    focusOnInput(index)
}

const isRepeat = task => {
    let boolean
    arrayMyTasks.forEach((item) => {
        if(item.description.toUpperCase() === task.toUpperCase()) {
            boolean = true
        }
        return
    })
    return boolean
}

const addEvent = () => {
    if(!inputNewTask.value) return

    if(isRepeat(inputNewTask.value)) {
        fillHtmlError(containerNewTask, 'Запись уже есть в списке дел!')
        inputNewTask.focus()
        return
    }

    if(selectPriority.value === '') {
        fillHtmlError(containerNewTask, 'Укажите важность предстоящего дела')
        return
    }
    
    deleteError()
    arrayMyTasks.push(new Task(inputNewTask.value, selectPriority.value))
    updateLocal()
    fillHtmlList()
    filterTasks()
    inputNewTask.value = ''
    selectPriority.value = ''
    inputNewTask.focus()
    
}

buttonAddNewTask.addEventListener('click', addEvent)

inputNewTask.addEventListener('keyup', e => {
    if(e.key === 'Enter') {
        addEvent()
    }
})