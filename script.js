document.addEventListener('DOMContentLoaded', function() {
    // Obtener todos los elementos de asignatura
    const subjects = document.querySelectorAll('.subject');
    const approvedSubjects = new Set();
    
    // Función para verificar si los requisitos están cumplidos
    function checkRequirements(required) {
        if (!required) return true;
        
        const requirements = required.split(',');
        return requirements.every(req => approvedSubjects.has(req.trim()));
    }
    
    // Función para actualizar el estado de todas las asignaturas
    function updateSubjects() {
        subjects.forEach(subject => {
            const subjectName = subject.getAttribute('data-name');
            const required = subject.getAttribute('data-required');
            
            // Si ya está aprobada, mantener el estado
            if (approvedSubjects.has(subjectName)) {
                subject.classList.add('approved');
                subject.classList.remove('enabled');
                return;
            }
            
            // Verificar requisitos
            if (checkRequirements(required)) {
                subject.classList.add('enabled');
            } else {
                subject.classList.remove('enabled');
            }
        });
    }
    
    // Agregar evento click a cada asignatura
    subjects.forEach(subject => {
        subject.addEventListener('click', function() {
            const subjectName = this.getAttribute('data-name');
            const required = this.getAttribute('data-required');
            
            // Solo permitir hacer clic si está habilitado o ya aprobado
            if (this.classList.contains('enabled') || this.classList.contains('approved')) {
                if (approvedSubjects.has(subjectName)) {
                    approvedSubjects.delete(subjectName);
                    this.classList.remove('approved');
                    this.classList.add('enabled');
                } else {
                    approvedSubjects.add(subjectName);
                    this.classList.remove('enabled');
                    this.classList.add('approved');
                }
                
                // Actualizar todas las asignaturas después del cambio
                updateSubjects();
            }
        });
    });
    
    // Inicializar el estado de las asignaturas
    updateSubjects();
    
    // Opcional: Cargar datos guardados en localStorage
    function loadProgress() {
        const savedProgress = localStorage.getItem('approvedSubjects');
        if (savedProgress) {
            const savedSubjects = JSON.parse(savedProgress);
            savedSubjects.forEach(subject => approvedSubjects.add(subject));
            updateSubjects();
        }
    }
    
    // Opcional: Guardar progreso en localStorage
    function saveProgress() {
        localStorage.setItem('approvedSubjects', JSON.stringify([...approvedSubjects]));
    }
    
    // Opcional: Botón para resetear progreso
    function addResetButton() {
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reiniciar Progreso';
        resetBtn.style.display = 'block';
        resetBtn.style.margin = '20px auto';
        resetBtn.style.padding = '10px 15px';
        resetBtn.style.backgroundColor = '#8d6e63';
        resetBtn.style.color = 'white';
        resetBtn.style.border = 'none';
        resetBtn.style.borderRadius = '5px';
        resetBtn.style.cursor = 'pointer';
        
        resetBtn.addEventListener('click', function() {
            approvedSubjects.clear();
            updateSubjects();
            localStorage.removeItem('approvedSubjects');
        });
        
        document.querySelector('.container').appendChild(resetBtn);
    }
    
    // Inicializar funciones opcionales
    loadProgress();
    addResetButton();
    
    // Guardar progreso cada vez que cambia
    document.addEventListener('click', function() {
        saveProgress();
    });
});
