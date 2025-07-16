// Objeto para almacenar el estado de los cursos
const coursesState = {};

// Función para inicializar el estado de los cursos
function initializeCourses() {
    const courses = document.querySelectorAll('.course');
    
    courses.forEach(course => {
        const courseId = course.id;
        
        // Verificar si ya hay un estado guardado en localStorage
        const savedState = localStorage.getItem(courseId);
        if (savedState === 'completed') {
            coursesState[courseId] = 'completed';
            course.classList.add('completed');
        } else {
            // Verificar requisitos para determinar estado inicial
            const requirements = course.dataset.req;
            const reqType = course.dataset.reqType;
            
            if (requirements === '') {
                // Sin requisitos - disponible desde el inicio
                coursesState[courseId] = 'unlocked';
                course.classList.add('unlocked');
            } else if (requirements === 'all') {
                // Requiere todas las materias (internado)
                coursesState[courseId] = 'locked';
                course.classList.add('locked');
            } else {
                // Verificar requisitos
                checkRequirements(course);
            }
        }
    });
}

// Función para verificar requisitos de un curso
function checkRequirements(course) {
    const courseId = course.id;
    const requirements = course.dataset.req;
    const reqType = course.dataset.reqType;
    
    if (!requirements) {
        return;
    }
    
    if (requirements === 'all') {
        // Caso especial para el internado que requiere todas las materias
        const allCourses = document.querySelectorAll('.course:not(#internado)');
        let allCompleted = true;
        
        allCourses.forEach(c => {
            if (coursesState[c.id] !== 'completed') {
                allCompleted = false;
            }
        });
        
        if (allCompleted) {
            coursesState[courseId] = 'unlocked';
            course.classList.remove('locked');
            course.classList.add('unlocked');
        } else {
            coursesState[courseId] = 'locked';
            course.classList.remove('unlocked', 'completed');
            course.classList.add('locked');
        }
        return;
    }
    
    const reqList = requirements.split(',');
    let requirementsMet = false;
    
    if (reqType === 'recommended') {
        // Para cursos con requisitos recomendados (no obligatorios)
        // Siempre están disponibles, pero verificamos si los recomendados están completados
        coursesState[courseId] = 'unlocked';
        course.classList.remove('locked');
        course.classList.add('unlocked');
        return;
    } else {
        // Para requisitos obligatorios
        requirementsMet = reqList.every(req => {
            return coursesState[req] === 'completed';
        });
    }
    
    if (requirementsMet) {
        coursesState[courseId] = 'unlocked';
        course.classList.remove('locked');
        course.classList.add('unlocked');
    } else {
        coursesState[courseId] = 'locked';
        course.classList.remove('unlocked', 'completed');
        course.classList.add('locked');
    }
}

// Función para alternar el estado de un curso
function toggleCourse(courseId) {
    const course = document.getElementById(courseId);
    
    if (coursesState[courseId] === 'locked') {
        return; // No hacer nada si el curso está bloqueado
    }
    
    if (coursesState[courseId] === 'unlocked') {
        // Marcar como completado
        coursesState[courseId] = 'completed';
        course.classList.remove('unlocked');
        course.classList.add('completed');
        localStorage.setItem(courseId, 'completed');
    } else if (coursesState[courseId] === 'completed') {
        // Desmarcar como completado
        coursesState[courseId] = 'unlocked';
        course.classList.remove('completed');
        course.classList.add('unlocked');
        localStorage.removeItem(courseId);
    }
    
    // Verificar si este curso es requisito de otros y actualizar su estado
    updateDependentCourses(courseId);
}

// Función para actualizar cursos que dependen del curso modificado
function updateDependentCourses(courseId) {
    const allCourses = document.querySelectorAll('.course');
    
    allCourses.forEach(course => {
        const requirements = course.dataset.req;
        if (requirements && requirements.includes(courseId)) {
            checkRequirements(course);
        }
    });
    
    // Caso especial para Modalidades de grado y prácticas profesionales que depende de todos los cursos
    const electiva 4 y 5 = document.getElementById('electiva');
    if (internado) {
        checkRequirements(electiva);
    }
}

// Función para reiniciar todo
function resetAll() {
    if (confirm('¿Estás seguro de que quieres reiniciar todo el progreso?')) {
        localStorage.clear();
        const courses = document.querySelectorAll('.course');
        
        courses.forEach(course => {
            const courseId = course.id;
            coursesState[courseId] = 'locked';
            course.classList.remove('completed', 'unlocked');
            
            // Solo los cursos sin requisitos comienzan desbloqueados
            if (course.dataset.req === '') {
                coursesState[courseId] = 'unlocked';
                course.classList.add('unlocked');
            } else if (course.dataset.req === 'all') {
                coursesState[courseId] = 'locked';
                course.classList.add('locked');
            } else {
                checkRequirements(course);
            }
        });
    }
}

// Inicializar al cargar la página
window.onload = function() {
    initializeCourses();
};
