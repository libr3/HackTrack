document.addEventListener('DOMContentLoaded', function () {
    const profileForm = document.getElementById('profileForm');
    const achievementForm = document.getElementById('achievementForm');
    const participationForm = document.getElementById('participationForm');
    const modalBg = document.getElementById('modal-bg');
    const closeModal = document.getElementById('close-modal');

    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileLocation = document.getElementById('profileLocation');
    const profileBio = document.getElementById('profileBio');
    const profileImage = document.getElementById('profileImage');

    const editProfileBtn = document.getElementById('editProfileBtn');
    const addAchievementBtn = document.getElementById('addAchievementBtn');
    const addParticipationBtn = document.getElementById('addParticipationBtn');
    const profilePicInput = document.getElementById('profilePicInput');

    let currentEditElement = null;

    // Function to open modal and display form
    function openModal(form) {
        modalBg.style.display = 'flex'; // Display modal background
        form.style.display = 'block'; // Display the specified form
    }

    // Function to close modal and hide all forms
    function closeModalFunction() {
        modalBg.style.display = 'none'; // Hide modal background
        profileForm.style.display = 'none';
        achievementForm.style.display = 'none';
        participationForm.style.display = 'none';
        currentEditElement = null;
    }

    // Event listener for edit profile button
    editProfileBtn.addEventListener('click', function () {
        openModal(profileForm);
    });

    // Event listener for adding achievement button
    addAchievementBtn.addEventListener('click', function () {
        openModal(achievementForm);
    });

    // Event listener for adding participation button
    addParticipationBtn.addEventListener('click', function () {
        openModal(participationForm);
    });

    // Event listener for closing modal
    closeModal.addEventListener('click', closeModalFunction);

    // Event listener for changing profile picture
    profilePicInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profileImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Event listener for saving profile details
    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const location = document.getElementById('location').value;
        const bio = document.getElementById('bio').value;

        profileName.textContent = name;
        profileEmail.textContent = email;
        profileLocation.textContent = location;
        profileBio.textContent = bio;

        closeModalFunction();
    });

    // Event listener for adding achievement
    achievementForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const achievement = document.getElementById('achievement').value;
        const achievementList = document.getElementById('achievementList');

        if (currentEditElement) {
            currentEditElement.textContent = achievement;
        } else {
            const li = document.createElement('li');
            li.textContent = achievement;

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.classList.add('edit-btn');
            editBtn.addEventListener('click', function () {
                document.getElementById('achievement').value = achievement;
                currentEditElement = li;
                openModal(achievementForm);
            });

            li.appendChild(editBtn);
            achievementList.appendChild(li);
        }

        document.getElementById('achievement').value = '';
        closeModalFunction();
    });

    // Event listener for adding participation
    participationForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const hackathonName = document.getElementById('hackathonName').value;
        const date = document.getElementById('date').value;
        const projectTitle = document.getElementById('projectTitle').value;
        const participationList = document.getElementById('participationList');

        if (currentEditElement) {
            currentEditElement.querySelector('.hackathon-name').textContent = hackathonName;
            currentEditElement.querySelector('.hackathon-date').textContent = date;
            currentEditElement.querySelector('.hackathon-title').textContent = projectTitle;
        } else {
            const tr = document.createElement('tr');

            const tdName = document.createElement('td');
            tdName.textContent = hackathonName;
            tdName.classList.add('hackathon-name');
            tr.appendChild(tdName);

            const tdDate = document.createElement('td');
            tdDate.textContent = date;
            tdDate.classList.add('hackathon-date');
            tr.appendChild(tdDate);

            const tdProject = document.createElement('td');
            tdProject.textContent = projectTitle;
            tdProject.classList.add('hackathon-title');
            tr.appendChild(tdProject);

            const tdEdit = document.createElement('td');
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.classList.add('edit-btn');
            editBtn.addEventListener('click', function () {
                document.getElementById('hackathonName').value = hackathonName;
                document.getElementById('date').value = date;
                document.getElementById('projectTitle').value = projectTitle;
                currentEditElement = tr;
                openModal(participationForm);
            });
            tdEdit.appendChild(editBtn);
            tr.appendChild(tdEdit);

            participationList.appendChild(tr);
        }

        document.getElementById('hackathonName').value = '';
        document.getElementById('date').value = '';
        document.getElementById('projectTitle').value = '';
        closeModalFunction();
    });

});
