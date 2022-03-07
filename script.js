'use strict'

const inputNewTask = document.getElementById('inputNewTask')
const selectPriority = document.getElementById('selectPriority')
const buttonAddNewTask = document.querySelector('.buttonAdd')
const containerNewTask = document.querySelector('.containerNewTask')
const containerMyTasks = document.querySelector('.containerMyTasks')
const lowPriorityTasks = document.querySelector('.lowPriority')
const highPriorityTasks = document.querySelector('.highPriority')
const containerLowTasks = document.querySelector('.contentLowTasks')
const containerHighTasks = document.querySelector('.contentHighTasks')
const withoutTasks = document.querySelector('.withoutTasks')
const buttonsHigh = document.querySelector('.buttonsHigh')
const buttonsLow = document.querySelector('.buttonsLow')
const btnNextHigh = document.querySelector('.buttonsHigh > .buttonNext')
const btnPrevHigh = document.querySelector('.buttonsHigh > .buttonPrev')
const btnNextLow = document.querySelector('.buttonsLow > .buttonNext')
const btnPrevLow = document.querySelector('.buttonsLow > .buttonPrev')

let arrTasksLowPriority = []
let arrTasksHighPriority = []

let pageNoLow
!localStorage.pageNoLow ? pageNoLow = 0 : pageNoLow = localStorage.getItem('pageNoLow')
let pageNoHigh
!localStorage.pageNoHigh ? pageNoHigh = 0 : pageNoHigh = localStorage.getItem('pageNoHigh')
const numberTasksToShow = 5

let partOfTasksLow
let partOfTasksHigh

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

const checkHiddenTasks = () => {
    if(arrayMyTasks.length) {
        containerMyTasks.classList.remove('hidden')
    } else {
        containerMyTasks.classList.add('hidden')
    }

    if(!arrTasksLowPriority.length) {
        containerLowTasks.classList.add('hidden')
    } else {
        containerLowTasks.classList.remove('hidden')
    }

    if(!arrTasksHighPriority.length) {
        containerHighTasks.classList.add('hidden')
    } else {
        containerHighTasks.classList.remove('hidden')
    }
}

const filterTasks = () => {
    arrTasksLowPriority = arrayMyTasks.length && arrayMyTasks.filter(item => item.priority === 'low')
    arrTasksHighPriority = arrayMyTasks.length && arrayMyTasks.filter(item => item.priority === 'high')
}

const addBtnNextPrev = (arrPriority, buttons) => {
    if(arrPriority.length > 5) {
        buttons.classList.remove('hidden')
    }
}

const makePartOfTasks = () => {
    partOfTasksLow = arrTasksLowPriority.slice(pageNoLow * numberTasksToShow, pageNoLow * numberTasksToShow + numberTasksToShow)
    partOfTasksHigh = arrTasksHighPriority.slice(pageNoHigh * numberTasksToShow, pageNoHigh * numberTasksToShow + numberTasksToShow)
}

const fillHtmlList = () => {
    highPriorityTasks.innerHTML = ''
    lowPriorityTasks.innerHTML = ''

    if(arrayMyTasks.length) {
        withoutTasks.classList.add('hidden')
        makePartOfTasks()

        if(!partOfTasksLow.length && pageNoLow && arrTasksLowPriority.length) {
        pageNoLow--
        makePartOfTasks()
        }

        if(!partOfTasksHigh.length && pageNoHigh && arrTasksHighPriority.length) {
            pageNoHigh--
            makePartOfTasks()
        }
        
        arrayMyTasks.forEach((item, index) => {

            if(partOfTasksHigh.includes(item)) {
                highPriorityTasks.innerHTML += createTemplate(item, index)
                selectPriority.value = ''
            }

            if(partOfTasksLow.includes(item)) {
                lowPriorityTasks.innerHTML += createTemplate(item, index)
                selectPriority.value = ''
            }
        })
    }
}

const disableBtnNextPrev = (pageNo, btnPrev, btnNext, arrTasks) => {
    if(pageNo == 0) {
        btnPrev.setAttribute('disabled', true)
    } else {
        btnPrev.removeAttribute('disabled')
    }

    if(pageNo * numberTasksToShow + numberTasksToShow > arrTasks.length) {
        btnNext.setAttribute('disabled', true)
    } else {
        btnNext.removeAttribute('disabled')
    }
}

const updateBtn = () => {
    addBtnNextPrev(arrTasksHighPriority, buttonsHigh)
    addBtnNextPrev(arrTasksLowPriority, buttonsLow)
    disableBtnNextPrev(pageNoHigh, btnPrevHigh, btnNextHigh, arrTasksHighPriority)
    disableBtnNextPrev(pageNoLow, btnPrevLow, btnNextLow, arrTasksLowPriority)
}

const updateLocal = () => {
    localStorage.setItem('tasks', JSON.stringify(arrayMyTasks))
    localStorage.setItem('pageNoLow', pageNoLow)
    localStorage.setItem('pageNoHigh', pageNoHigh)
}

const updateTasks = () => {
    updateLocal()
    filterTasks()
    checkHiddenTasks()
    fillHtmlList()
}

updateTasks()
updateBtn()

const completedTask = index => {
    arrayMyTasks[index].comleted = !arrayMyTasks[index].comleted
    updateTasks()
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

const hideBtnNextPrev = () => {
    if(arrTasksLowPriority.length <= 5) {
        buttonsLow.classList.add('hidden') 
    }
    if(arrTasksHighPriority.length <= 5) {
        buttonsHigh.classList.add('hidden') 
    }
}

const deleteTask = index => {
    arrayMyTasks.splice(index, 1)
    
    updateTasks()
    updateBtn()
    hideBtnNextPrev()
    
    if(arrayMyTasks.length === 0) {
        containerMyTasks.classList.add('hidden')
        withoutTasks.classList.remove('hidden')
    }
}

const createTaskChange = (index, task) => {
    return `
    <div class="itemMyTask">
        <input type="text" value="${task}" class="InputForEdit" maxlength="20" autofocus>
        <button onclick="saveEditedTask(${index})" class="button buttonSave">&#43;</button>
    </div>
` 
}

const checkOfRepeat = (index) => {
    const input = document.querySelector('.InputForEdit')
    let bool
    
        if(isRepeat(input.value)) {
            const divTask = input.parentElement
            fillHtmlError(divTask, 'Запись уже есть в списке дел!')
            bool = true
        }
    return bool
}

function saveEditedTask (index) {
    const input = document.querySelector('.InputForEdit')

    if(input.value === arrayMyTasks[index].description) {
        arrayMyTasks[index].description = input.value
        updateTasks()
    }

    else if(checkOfRepeat(index)) {
        return

    } else {
        arrayMyTasks[index].description = input.value
        updateTasks()
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
    if(document.querySelector('.InputForEdit')) {
        updateTasks()
    }

    fillHtmlEditTask(index)
    focusOnInput(index)

    const inp = document.querySelector('.InputForEdit')

    inp.addEventListener('keyup', e => {
        if(e.key === 'Enter') {
            saveEditedTask(index)
        }
    })
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
    updateTasks()
    updateBtn()

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

btnNextHigh.addEventListener('click', () => {
    pageNoHigh++
    updateTasks()
    updateBtn()
})

btnPrevHigh.addEventListener('click', () => {
    if(pageNoHigh > 0) {
        pageNoHigh--
        updateTasks()
        updateBtn()
    }
})

btnNextLow.addEventListener('click', () => {
    pageNoLow++
    updateTasks()
    updateBtn()
})

btnPrevLow.addEventListener('click', () => {
    if(pageNoLow > 0) {
        pageNoLow--
        updateTasks()
        updateBtn() 
    }
})