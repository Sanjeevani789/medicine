document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('medicineForm').addEventListener('submit', function (event) {
        event.preventDefault();
    });

    loadReminders();
});

function addMedicine() {
    const medicineName = document.getElementById('medicineName').value;
    const medicineTime = document.getElementById('medicineTime').value;
    const recurring = document.getElementById('recurring').checked;

    if (medicineName && medicineTime) {
        const reminderList = JSON.parse(localStorage.getItem('reminders')) || [];
        const newReminder = { id: Date.now(), name: medicineName, time: medicineTime, recurring: recurring };

        reminderList.push(newReminder);
        localStorage.setItem('reminders', JSON.stringify(reminderList));

        loadReminders();
        clearForm();
    } else {
        alert('Please enter both medicine name and time.');
    }
}

function loadReminders() {
    const reminderList = JSON.parse(localStorage.getItem('reminders')) || [];
    const upcomingReminders = document.getElementById('reminderList');

    upcomingReminders.innerHTML = '';

    if (reminderList.length === 0) {
        upcomingReminders.innerHTML = '<p>No upcoming reminders</p>';
    } else {
        reminderList.forEach(function (reminder) {
            const li = document.createElement('li');
            li.textContent = `${reminder.name} - ${reminder.time} ${reminder.recurring ? '(Recurring)' : ''}`;

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', function () {
                openEditModal(reminder);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function () {
                deleteReminder(reminder.id);
            });

            li.appendChild(editButton);
            li.appendChild(deleteButton);
            upcomingReminders.appendChild(li);
        });
    }
}

function openEditModal(reminder) {
    // Create a modal for editing
    const modal = document.createElement('div');
    modal.className = 'modal';

    const content = document.createElement('div');
    content.className = 'modal-content';

    const closeButton = document.createElement('span');
    closeButton.className = 'close';
    closeButton.textContent = '×';
    closeButton.addEventListener('click', function () {
        document.body.removeChild(modal);
    });

    const editForm = document.createElement('form');
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Medicine Name:';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = reminder.name;
    nameInput.required = true;

    const timeLabel = document.createElement('label');
    timeLabel.textContent = 'Time:';
    const timeInput = document.createElement('input');
    timeInput.type = 'time';
    timeInput.value = reminder.time;
    timeInput.required = true;

    const recurringLabel = document.createElement('label');
    recurringLabel.textContent = 'Recurring:';
    const recurringCheckbox = document.createElement('input');
    recurringCheckbox.type = 'checkbox';
    recurringCheckbox.checked = reminder.recurring;

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save Changes';
    saveButton.type = 'button';
    saveButton.addEventListener('click', function () {
        saveChanges(reminder.id, nameInput.value, timeInput.value, recurringCheckbox.checked);
        document.body.removeChild(modal);
    });

    editForm.appendChild(nameLabel);
    editForm.appendChild(nameInput);
    editForm.appendChild(timeLabel);
    editForm.appendChild(timeInput);
    editForm.appendChild(recurringLabel);
    editForm.appendChild(recurringCheckbox);
    editForm.appendChild(saveButton);

    content.appendChild(closeButton);
    content.appendChild(editForm);
    modal.appendChild(content);

    document.body.appendChild(modal);
}

function saveChanges(reminderId, newName, newTime, newRecurring) {
    let reminderList = JSON.parse(localStorage.getItem('reminders')) || [];
    const index = reminderList.findIndex((reminder) => reminder.id === reminderId);

    if (index !== -1) {
        reminderList[index].name = newName;
        reminderList[index].time = newTime;
        reminderList[index].recurring = newRecurring;
        localStorage.setItem('reminders', JSON.stringify(reminderList));
        loadReminders();
    }
}

function deleteReminder(reminderId) {
    let reminderList = JSON.parse(localStorage.getItem('reminders')) || [];
    reminderList = reminderList.filter((reminder) => reminder.id !== reminderId);
    localStorage.setItem('reminders', JSON.stringify(reminderList));
    loadReminders();
}

function clearForm() {
    document.getElementById('medicineName').value = '';
    document.getElementById('medicineTime').value = '';
    document.getElementById('recurring').checked = false;
}