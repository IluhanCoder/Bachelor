const fs = require('fs');
const path = require('path');

// Translation dictionary (Ukrainian → English)
const translations = {
  // Common buttons & actions
  'Видалити': 'Delete',
  'Редагувати': 'Edit',
  'Змінити': 'Change',
  'Зберегти': 'Save',
  'Скасувати': 'Cancel',
  'Створити': 'Create',
  'Додати': 'Add',
  'Оновити': 'Update',
  'Закрити': 'Close',
  'Відкрити': 'Open',
  'Підтвердити': 'Confirm',
  
  // Task & Sprint specific
  'Деталі': 'Details',
  'Прибрати': 'Remove',
  'До спрінту': 'To Sprint',
  'Задачі відсутні': 'No tasks available',
  'Спрінти відсутні': 'No sprints available',
  'Завершено': 'Completed',
  'Виконано': 'Completed',
  'В процесі': 'In Progress',
  'Не розпочато': 'Not Started',
  'Заблоковано': 'Blocked',
  
  // Priority levels
  'Висока': 'High',
  'Середня': 'Medium',
  'Низька': 'Low',
  'Критична': 'Critical',
  
  // Form labels
  'Назва': 'Name',
  'Опис': 'Description',
  'Статус': 'Status',
  'Пріоритет': 'Priority',
  'Виконавець': 'Assignee',
  'Дата початку': 'Start Date',
  'Дата завершення': 'End Date',
  'Історія': 'Story',
  'Коментар': 'Comment',
  'Коментарі': 'Comments',
  
  // Project management
  'Проект': 'Project',
  'Проекти': 'Projects',
  'Беклог': 'Backlog',
  'Беклоги': 'Backlogs',
  'Спринт': 'Sprint',
  'Спринти': 'Sprints',
  'Задача': 'Task',
  'Задачі': 'Tasks',
  'Учасник': 'Participant',
  'Учасники': 'Participants',
  'Власник': 'Owner',
  'Змінити власника': 'Change Owner',
  'Видалити проект': 'Delete Project',
  'Новий проект': 'New Project',
  'Новий беклог': 'New Backlog',
  'Новий спринт': 'New Sprint',
  'Нова задача': 'New Task',
  
  // User & Profile
  'Профіль': 'Profile',
  'Редагувати профіль': 'Edit Profile',
  'Ім\'я': 'Name',
  'Прізвище': 'Surname',
  'Email': 'Email',
  'Пароль': 'Password',
  'Новий пароль': 'New Password',
  'Підтвердіть пароль': 'Confirm Password',
  'Увійти': 'Sign In',
  'Вийти': 'Sign Out',
  'Зареєструватися': 'Sign Up',
  'Реєстрація': 'Registration',
  
  // Analytics
  'Аналітика': 'Analytics',
  'Швидка статистика': 'Quick Statistics',
  'Графік швидкості': 'Velocity Chart',
  'Топ контрибуторів': 'Top Contributors',
  'Всього SP': 'Total SP',
  'Виконано SP': 'Completed SP',
  'Немає даних для відображення': 'No data to display',
  'За період': 'For Period',
  'Виберіть період': 'Select Period',
  'Від': 'From',
  'До': 'To',
  
  // Month names
  'Січ': 'Jan',
  'Лют': 'Feb',
  'Бер': 'Mar',
  'Кві': 'Apr',
  'Тра': 'May',
  'Чер': 'Jun',
  'Лип': 'Jul',
  'Сер': 'Aug',
  'Вер': 'Sep',
  'Жов': 'Oct',
  'Лис': 'Nov',
  'Гру': 'Dec',
  
  // Full month names
  'Січень': 'January',
  'Лютий': 'February',
  'Березень': 'March',
  'Квітень': 'April',
  'Травень': 'May',
  'Червень': 'June',
  'Липень': 'July',
  'Серпень': 'August',
  'Вересень': 'September',
  'Жовтень': 'October',
  'Листопад': 'November',
  'Грудень': 'December',
  
  // Rights & Permissions
  'Права': 'Rights',
  'Редагувати права': 'Edit Rights',
  'Редагувати задачі': 'Edit Tasks',
  'Редагувати проєкт': 'Edit Project',
  'Переглядати задачі': 'View Tasks',
  'Переглядати проєкт': 'View Project',
  'Керувати спрінтами': 'Manage Sprints',
  'Керувати задачами': 'Manage Tasks',
  
  // Invites
  'Запросити': 'Invite',
  'Запрошення': 'Invitation',
  'Запрошення до проєкту': 'Project Invitation',
  'Прийняти': 'Accept',
  'Відхилити': 'Decline',
  
  // Empty states & messages
  'Користувачі відсутні': 'No users found',
  'Спробуйте змінити параметри пошуку': 'Try changing search parameters',
  'Проекти відсутні': 'No projects available',
  'Беклоги відсутні': 'No backlogs available',
  
  // Confirmation messages
  'Ви впевнені?': 'Are you sure?',
  'Ви дійсно хочете видалити цей елемент?': 'Do you really want to delete this item?',
  'Дію не можна скасувати': 'This action cannot be undone',
  
  // Story Points
  'Очки історії': 'Story Points',
  'SP': 'SP',
  'Story Points': 'Story Points',
  
  // Board statuses
  'Бекло': 'Backlog',
  'В роботі': 'In Progress',
  'На перевірці': 'In Review',
  'Готово': 'Done',
  
  // Time
  'Тиждень': 'Week',
  'Місяць': 'Month',
  'Рік': 'Year',
  'Сьогодні': 'Today',
  'Вчора': 'Yesterday',
  'Завтра': 'Tomorrow'
};

// Special icon button replacements
const iconButtonReplacements = {
  // Delete buttons - replace text with trash icon
  'Видалити': { icon: '🗑️', title: 'Delete', color: 'red' },
  // Edit buttons - replace text with pencil icon  
  'Редагувати': { icon: '✏️', title: 'Edit', color: 'gray' },
  'Змінити': { icon: '✏️', title: 'Edit', color: 'gray' }
};

// Function to process a single file
function translateFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Track changes for reporting
  const changes = [];
  
  // Replace icon buttons first (higher priority)
  for (const [ukrText, replacement] of Object.entries(iconButtonReplacements)) {
    const buttonPattern = new RegExp(
      `(<button[^>]*>\\s*)${ukrText}(\\s*</button>)`,
      'g'
    );
    
    const newContent = content.replace(buttonPattern, (match, before, after) => {
      // Check if it's already an icon
      if (match.includes('🗑️') || match.includes('✏️')) {
        return match;
      }
      
      // Adjust button styling for icons
      let newMatch = match;
      
      // Change padding for icon buttons
      newMatch = newMatch.replace(/px-3/g, 'px-2.5');
      newMatch = newMatch.replace(/text-xs font-medium/g, 'text-base');
      
      // Add title attribute if not present
      if (!newMatch.includes('title=')) {
        newMatch = newMatch.replace('<button', `<button title="${replacement.title}"`);
      }
      
      // Replace text with icon
      newMatch = newMatch.replace(ukrText, replacement.icon);
      
      changes.push(`Icon button: "${ukrText}" → ${replacement.icon}`);
      modified = true;
      return newMatch;
    });
    
    if (newContent !== content) {
      content = newContent;
    }
  }
  
  // Then replace regular text translations
  for (const [ukrainian, english] of Object.entries(translations)) {
    // Skip if this is an icon button text (already handled above)
    if (iconButtonReplacements[ukrainian]) continue;
    
    const regex = new RegExp(
      // Match Ukrainian text in JSX content, avoiding attributes
      `(?<=>)([^<]*?)${ukrainian.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^<]*?)(?=<)`,
      'g'
    );
    
    const newContent = content.replace(regex, (match) => {
      if (match.trim() === ukrainian) {
        changes.push(`"${ukrainian}" → "${english}"`);
        modified = true;
        return match.replace(ukrainian, english);
      }
      return match;
    });
    
    if (newContent !== content) {
      content = newContent;
    }
  }
  
  // Write back if modified
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Modified: ${changes.length} changes made`);
    changes.forEach(change => console.log(`  - ${change}`));
  } else {
    console.log(`  No changes needed`);
  }
  
  return modified;
}

// Recursively find all .tsx files
function findTsxFiles(dir) {
  const files = [];
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, build, etc.
      if (!['node_modules', 'build', 'dist', '.git'].includes(item)) {
        files.push(...findTsxFiles(fullPath));
      }
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main execution
const clientSrcDir = path.join(__dirname, 'client', 'src');

console.log('='.repeat(60));
console.log('🌍 BACKLOGGER INTERNATIONALIZATION SCRIPT');
console.log('='.repeat(60));
console.log(`Source directory: ${clientSrcDir}\n`);

const tsxFiles = findTsxFiles(clientSrcDir);
console.log(`Found ${tsxFiles.length} TypeScript files\n`);

let modifiedCount = 0;

for (const file of tsxFiles) {
  const wasModified = translateFile(file);
  if (wasModified) {
    modifiedCount++;
  }
  console.log('');
}

console.log('='.repeat(60));
console.log(`✅ TRANSLATION COMPLETE`);
console.log(`Modified ${modifiedCount} out of ${tsxFiles.length} files`);
console.log('='.repeat(60));
