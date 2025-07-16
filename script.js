document.addEventListener('DOMContentLoaded', function() {
    // Obtener todos los elementos de asignatura
    const subjects = document.querySelectorAll('.subject');
    let approvedSubjects = new Set(JSON.parse(localStorage.getItem('approvedSubjects') || '[]'));
    
    // Función para verificar requisitos
    const checkRequirements = (required) => {
        if (!required) return true;
        return required.split(',').every(req => approvedSubjects.has(req.trim()));
    };
    
    // Actualizar estado visual de las asignaturas
    const updateSubjects = () => {
        subjects.forEach(subject => {
            const subjectName = subject.dataset.name;
            const required = subject.dataset.required || '';
            
            subject.classList.remove('enabled', 'approved');
            
            if (approvedSubjects.has(subjectName)) {
                subject.classList.add('approved');
            } else if (checkRequirements(required)) {
                subject.classList.add('enabled');
            }
        });
    };
    
    // Manejar clic en asignaturas
    const handleClick = (e) => {
        const subject = e.target;
        const subjectName = subject.dataset.name;
        
        if (subject.classList.contains('enabled') || subject.classList.contains('approved')) {
            if (approvedSubjects.has(subjectName)) {
                approvedSubjects.delete(subjectName);
            } else {
                approvedSubjects.add(subjectName);
            }
            
            localStorage.setItem('approvedSubjects', JSON.stringify([...approvedSubjects]));
            updateSubjects();
        }
    };
    
    // Agregar eventos
    subjects.forEach(subject => {
        subject.addEventListener('click', handleClick);
    });
    
    // Botón para resetear
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reiniciar Progreso';
    resetBtn.style.cssText = `
        display: block;
        margin: 20px auto;
        padding: 10px 15px;
        background-color: #8d6e63;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;
    resetBtn.addEventListener('click', () => {
        approvedSubjects.clear();
        localStorage.removeItem('approvedSubjects');
        updateSubjects();
    });
    
    document.querySelector('.container').appendChild(resetBtn);
    updateSubjects();
});
