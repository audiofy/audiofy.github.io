// ====================================
// НАСТРОЙКА SUPABASE ДЛЯ HTML/CSS/JS
// ====================================

// 🔑 ШАГ 1: ЗАМЕНИТЕ ЭТИ ДАННЫЕ НА СВОИ ИЗ SUPABASE
const SUPABASE_URL = 'https://fhmwabxnaliwaziaodtt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZobXdhYnhuYWxpd2F6aWFvZHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMzA4MDUsImV4cCI6MjA3NjcwNjgwNX0.cGPjRRZPOrNA9hod-ze-TX97lGGBDL7tTzxQR7se7vg';

// Инициализация Supabase клиента
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ====================================
// ФУНКЦИЯ СОХРАНЕНИЯ ЗАЯВКИ
// ====================================
async function saveSignup(email, project) {
    try {
        // Отправляем данные в таблицу 'early_access_signups'
        const { data, error } = await supabaseClient
            .from('early_access_signups')
            .insert([
                {
                    email: email,
                    project_description: project,
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) {
            console.error('Ошибка сохранения:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Заявка успешно сохранена!', data);
        return { success: true, data: data };

    } catch (err) {
        console.error('Непредвиденная ошибка:', err);
        return { success: false, error: err.message };
    }
}

// ====================================
// ОБРАБОТЧИК ФОРМЫ
// ====================================
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('ctaForm');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const email = document.getElementById('email').value;
            const project = document.getElementById('project').value;
            
            // Показываем индикатор загрузки (опционально)
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = 'Отправка...';
            submitButton.disabled = true;
            
            // Сохраняем в Supabase
            const result = await saveSignup(email, project);
            
            if (result.success) {
                // Успех! Показываем сообщение
                document.getElementById('form-content').style.display = 'none';
                document.getElementById('success-message').style.display = 'flex';
                
                // Очищаем форму
                form.reset();
                
                // Возвращаем форму через 3 секунды
                setTimeout(function() {
                    document.getElementById('form-content').style.display = 'block';
                    document.getElementById('success-message').style.display = 'none';
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }, 3000);
                
            } else {
                // Ошибка
                alert('Произошла ошибка при отправке. Попробуйте ещё раз.');
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    }
});

// ====================================
// ДОПОЛНИТЕЛЬНАЯ ФУНКЦИЯ: ПОЛУЧИТЬ ВСЕ ЗАЯВКИ
// ====================================
async function getAllSignups() {
    const { data, error } = await supabaseClient
        .from('early_access_signups')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.error('Ошибка получения данных:', error);
        return [];
    }
    
    return data;
}

// Пример использования (откройте консоль браузера и напишите):
// getAllSignups().then(data => console.table(data));
