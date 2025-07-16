document.addEventListener('DOMContentLoaded', function() {
    // Obtener todos los elementos de asignatura
    const subjects = document.querySelectorAll('.subject');
    let approvedSubjects = new Set();
    
    // Cargar progreso guardado
    function loadProgress() {
        const savedProgress = localStorage.getItem('approvedSubjects');
        if (savedProgress) {
            approvedSubjects = new Set(JSON.parse(savedProgress));
            updateSubjects();
        }
    }
    
    // Guardar progreso
    function saveProgress() {
        localStorage.setItem('approvedSubjects', JSON.stringify([...approvedSubjects]));
    }
    
    // Verificar requisitos
    function checkRequirements(required) {
        if (!required || required === "") return true;
        
        const requirements = required.split(',');
        return requirements.every(req => approvedSubjects.has(req.trim()));
    }
    
    // Actualizar estado de todas las asignaturas
    function updateSubjects() {
        subjects.forEach(subject => {
            const subjectName = subject.getAttribute('data-name');
            const required = subject.getAttribute('data-required');
            
            // Resetear clases
            subject.classList.remove('enabled', 'approved');
            
            // Si ya está aprobada
            if (approvedSubjects.has(subjectName)) {
                subject.classList.add('approved');
                return;
            }
            
            // Verificar requisitos
            if (checkRequirements(required)) {
                subject.classList.add('enabled');
            }
        });
    }
    
    // Manejar clic en asignaturas
    function handleSubjectClick() {
        const subjectName = this.getAttribute('data-name');
        
        // Solo permitir hacer clic si está habilitado o ya aprobado
        if (this.classList.contains('enabled') || this.classList.contains('approved')) {
            if (approvedSubjects.has(subjectName)) {
                approvedSubjects.delete(subjectName);
            } else {
                approvedSubjects.add(subjectName);
            }
            
            updateSubjects();
            saveProgress();
        }
    }
    
    // Agregar evento click a cada asignatura
    subjects.forEach(subject => {
        subject.addEventListener('click', handleSubjectClick);
    });
    
    // Botón para resetear progreso
    function addResetButton() {
        const container = document.querySelector('.container');
        if (!container) return;
        
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
        
        container.appendChild(resetBtn);
    }
    
    // Inicializar
    loadProgress();
    addResetButton();
    updateSubjects();
});
