const addBtn = document.querySelector("#addBtn")
const main = document.querySelector("#main")

// Add search functionality
const searchContainer = document.createElement("div")
searchContainer.className = "search-container"
searchContainer.innerHTML = `
    <input type="text" id="searchInput" placeholder="Search notes...">
    <button id="darkModeToggle">
        <i class="fas fa-moon"></i>
    </button>
`
document.body.insertBefore(searchContainer, main)

const searchInput = document.querySelector("#searchInput")
const darkModeToggle = document.querySelector("#darkModeToggle")

// Dark mode functionality
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode")
    const icon = darkModeToggle.querySelector("i")
    icon.classList.toggle("fa-moon")
    icon.classList.toggle("fa-sun")
})

// Search functionality
searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase()
    const notes = document.querySelectorAll(".note")
    
    notes.forEach(note => {
        const title = note.querySelector(".note-title").value.toLowerCase()
        const content = note.querySelector("textarea").value.toLowerCase()
        const isVisible = title.includes(searchTerm) || content.includes(searchTerm)
        note.style.display = isVisible ? "flex" : "none"
    })
})

addBtn.addEventListener(
    "click",
    function() {
        addNote()
    }
)
const saveNotes = () => {
    const notes = document.querySelectorAll(".note")
    const data = []
    
    notes.forEach(note => {
        data.push({
            title: note.querySelector(".note-title").value,
            content: note.querySelector("textarea").value,
            timestamp: note.querySelector(".note-meta").dataset.timestamp
        })
    })
    
    if (data.length === 0) {
        localStorage.removeItem("notes")
    } else {
        localStorage.setItem("notes", JSON.stringify(data))
    }
}

const addNote = (text = "", title = "", timestamp = null) => {
    const note = document.createElement("div")
    note.classList.add("note")
    
    const currentTime = timestamp || new Date().toISOString()
    
    note.innerHTML = `
        <div class="tool">
            <i class="save fas fa-save"></i>
            <i class="trash fas fa-trash"></i>
        </div>
        <input type="text" class="note-title" placeholder="Note Title" value="${title}">
        <textarea placeholder="Write your note here...">${text}</textarea>
        <div class="note-meta" data-timestamp="${currentTime}">
            Last edited: ${new Date(currentTime).toLocaleString()}
        </div>
    `

    note.querySelector(".trash").addEventListener(
        "click",
        function() {
            note.remove()
            saveNotes()
        }
    )
    note.querySelector(".save").addEventListener(
        "click",
        function() {
            saveNotes()
            const meta = note.querySelector(".note-meta")
            meta.dataset.timestamp = new Date().toISOString()
            meta.textContent = `Last edited: ${new Date().toLocaleString()}`
        }
    )
    note.querySelector("textarea").addEventListener(
        "input",
        function() {
            saveNotes()
            const meta = note.querySelector(".note-meta")
            meta.dataset.timestamp = new Date().toISOString()
            meta.textContent = `Last edited: ${new Date().toLocaleString()}`
        }
    )
    note.querySelector(".note-title").addEventListener(
        "input",
        function() {
            saveNotes()
        }
    )
    main.appendChild(note)
    saveNotes()
}

(
    function() {
        const lsNotes = JSON.parse(localStorage.getItem("notes"))
        if (lsNotes === null) {
            addNote()
        } else {
            lsNotes.forEach(note => {
                addNote(note.content, note.title, note.timestamp)
            })
        }
    }
)()