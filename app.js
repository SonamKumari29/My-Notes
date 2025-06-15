const addBtn = document.querySelector("#addBtn")
const main = document.querySelector("#main")

// Add search and filter functionality
const searchContainer = document.createElement("div")
searchContainer.className = "search-container"
searchContainer.innerHTML = `
    <input type="text" id="searchInput" placeholder="Search notes...">
    <select id="categoryFilter">
        <option value="">All Categories</option>
        <option value="work">Work</option>
        <option value="personal">Personal</option>
        <option value="ideas">Ideas</option>
        <option value="tasks">Tasks</option>
    </select>
    <button id="darkModeToggle">
        <i class="fas fa-moon"></i>
    </button>
`
document.body.insertBefore(searchContainer, main)

const searchInput = document.querySelector("#searchInput")
const categoryFilter = document.querySelector("#categoryFilter")
const darkModeToggle = document.querySelector("#darkModeToggle")

// Dark mode functionality
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode")
    const icon = darkModeToggle.querySelector("i")
    icon.classList.toggle("fa-moon")
    icon.classList.toggle("fa-sun")
    // Save dark mode preference
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"))
})

// Load dark mode preference
if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode")
    darkModeToggle.querySelector("i").classList.replace("fa-moon", "fa-sun")
}

// Search and filter functionality
function filterNotes() {
    const searchTerm = searchInput.value.toLowerCase()
    const selectedCategory = categoryFilter.value
    const notes = document.querySelectorAll(".note")
    
    notes.forEach(note => {
        const title = note.querySelector(".note-title").value.toLowerCase()
        const content = note.querySelector("textarea").value.toLowerCase()
        const category = note.dataset.category
        const isVisible = (title.includes(searchTerm) || content.includes(searchTerm)) &&
                         (!selectedCategory || category === selectedCategory)
        note.style.display = isVisible ? "flex" : "none"
    })
}

searchInput.addEventListener("input", filterNotes)
categoryFilter.addEventListener("change", filterNotes)

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
            timestamp: note.querySelector(".note-meta").dataset.timestamp,
            category: note.dataset.category,
            color: note.dataset.color
        })
    })
    
    try {
        if (data.length === 0) {
            localStorage.removeItem("notes")
        } else {
            localStorage.setItem("notes", JSON.stringify(data))
        }
        return true
    } catch (error) {
        console.error("Error saving notes:", error)
        return false
    }
}

const showSaveFeedback = (saveIcon) => {
    saveIcon.classList.add("saved")
    setTimeout(() => {
        saveIcon.classList.remove("saved")
    }, 500)
}

// Add delete confirmation popup to body
const deleteConfirmPopup = document.createElement("div");
deleteConfirmPopup.className = "delete-confirm-overlay";
deleteConfirmPopup.innerHTML = `
    <div class="delete-confirm-popup">
        <h3>Delete Note</h3>
        <p>Are you sure you want to delete this note? This action cannot be undone.</p>
        <div class="delete-confirm-buttons">
            <button class="cancel-btn">Cancel</button>
            <button class="delete-btn">Delete</button>
        </div>
    </div>
`;
document.body.appendChild(deleteConfirmPopup);

// Function to show delete confirmation
const showDeleteConfirmation = (note) => {
    deleteConfirmPopup.classList.add("active");
    
    const cancelBtn = deleteConfirmPopup.querySelector(".cancel-btn");
    const deleteBtn = deleteConfirmPopup.querySelector(".delete-btn");
    
    const handleCancel = () => {
        deleteConfirmPopup.classList.remove("active");
        cancelBtn.removeEventListener("click", handleCancel);
        deleteBtn.removeEventListener("click", handleDelete);
    };
    
    const handleDelete = () => {
        note.style.animation = "fadeOut 0.3s ease forwards";
        setTimeout(() => {
            note.remove();
            saveNotes();
            deleteConfirmPopup.classList.remove("active");
        }, 300);
        cancelBtn.removeEventListener("click", handleCancel);
        deleteBtn.removeEventListener("click", handleDelete);
    };
    
    cancelBtn.addEventListener("click", handleCancel);
    deleteBtn.addEventListener("click", handleDelete);
};

const addNote = (text = "", title = "", timestamp = null, category = "", color = "") => {
    const note = document.createElement("div");
    note.classList.add("note");
    
    const currentTime = timestamp || new Date().toISOString();
    
    note.innerHTML = `
        <div class="tool">
            <div class="tool-left">
                <select class="category-select">
                    <option value="work" ${category === 'work' ? 'selected' : ''}>Work</option>
                    <option value="personal" ${category === 'personal' ? 'selected' : ''}>Personal</option>
                    <option value="ideas" ${category === 'ideas' ? 'selected' : ''}>Ideas</option>
                    <option value="tasks" ${category === 'tasks' ? 'selected' : ''}>Tasks</option>
                </select>
                <div class="color-selector">
                    <div class="current-color" style="background-color: ${color || '#ffffff'}" title="Change color"></div>
                    <div class="color-palette">
                        <div class="color-option" data-color="#ffffff" title="White"></div>
                        <div class="color-option" data-color="#dbeafe" title="Blue"></div>
                        <div class="color-option" data-color="#dcfce7" title="Green"></div>
                        <div class="color-option" data-color="#fce7f3" title="Pink"></div>
                    </div>
                </div>
                <div class="tool-actions">
                    <i class="save fas fa-save" title="Save Note"></i>
                    <i class="trash fas fa-trash" title="Delete Note"></i>
                </div>
            </div>
        </div>
        <div class="note-content">
            <input type="text" class="note-title" placeholder="Note Title" value="${title}">
            <textarea placeholder="Write your note here...">${text}</textarea>
            <div class="note-meta" data-timestamp="${currentTime}">
                Last edited: ${new Date(currentTime).toLocaleString()}
            </div>
        </div>
    `;

    // Set initial category and color
    note.dataset.category = category || 'personal';
    note.dataset.color = color || '#ffffff';
    
    // Color selection functionality
    const colorSelector = note.querySelector('.color-selector');
    const currentColor = note.querySelector('.current-color');
    const colorPalette = note.querySelector('.color-palette');
    const colorOptions = note.querySelectorAll('.color-option');

    // Toggle color palette
    currentColor.addEventListener('click', (e) => {
        e.stopPropagation();
        colorPalette.classList.toggle('active');
    });

    // Close palette when clicking outside
    document.addEventListener('click', (e) => {
        if (!colorSelector.contains(e.target)) {
            colorPalette.classList.remove('active');
        }
    });

    // Color selection
    colorOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const newColor = option.dataset.color;
            note.dataset.color = newColor;
            currentColor.style.backgroundColor = newColor;
            colorPalette.classList.remove('active');
            saveNotes();
        });
    });

    // Delete functionality
    note.querySelector(".trash").addEventListener("click", () => {
        showDeleteConfirmation(note);
    });

    // Save functionality
    note.querySelector(".save").addEventListener("click", () => {
        if (saveNotes()) {
            const meta = note.querySelector(".note-meta");
            meta.dataset.timestamp = new Date().toISOString();
            meta.textContent = `Last edited: ${new Date().toLocaleString()}`;
            showSaveFeedback(note.querySelector(".save"));
        }
    });

    // Auto-save on input with debounce
    let saveTimeout;
    const autoSave = () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            if (saveNotes()) {
                const meta = note.querySelector(".note-meta");
                meta.dataset.timestamp = new Date().toISOString();
                meta.textContent = `Last edited: ${new Date().toLocaleString()}`;
            }
        }, 1000);
    };

    note.querySelector("textarea").addEventListener("input", autoSave);
    note.querySelector(".note-title").addEventListener("input", autoSave);

    // Category change handler
    note.querySelector(".category-select").addEventListener("change", (e) => {
        note.dataset.category = e.target.value;
        saveNotes();
        filterNotes();
    });

    main.appendChild(note);
    saveNotes();
};

(
    function() {
        try {
            const lsNotes = JSON.parse(localStorage.getItem("notes"))
            if (lsNotes === null) {
                addNote()
            } else {
                lsNotes.forEach(note => {
                    addNote(note.content, note.title, note.timestamp, note.category, note.color)
                })
            }
        } catch (error) {
            console.error("Error loading notes:", error)
            addNote()
        }
    }
)()