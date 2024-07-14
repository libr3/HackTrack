# HackTrack

HackTrack is a web application that helps users track their participation in hackathons, manage projects, and showcase achievements. It provides a platform for users to log hackathons they have participated in, add details about their projects, and list any awards they have received.

## Features

- **User Authentication**: Secure user authentication using local strategy (username/password) and Google OAuth 2.0.
- **Profile Management**: Users can view and edit their profiles, including profile picture, name, email, location, and bio.
- **Hackathon Tracking**: Log and display hackathons a user has participated in, including details like hackathon name, location, date, and project title.
- **Project Management**: Users can add details about their projects for each hackathon they participated in, such as project title, description, technology stack, repository link, and demo link.
- **Achievement Showcase**: Display awards and achievements earned by the user.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Frontend**: HTML, CSS (with Bootstrap), JavaScript (Vanilla JS)
- **Templating Engine**: EJS
- **Authentication**: Passport.js (Local and Google OAuth 2.0)
- **Encryption**: Bcrypt.js
- **Session Management**: Express Session

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/hacktrack.git
   cd hacktrack
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Define the following variables:
     ```plaintext
     SESSION_SECRET=your_session_secret
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     ```

4. Set up PostgreSQL:
   - Create a PostgreSQL database.
   - Update `dbmodel.js` with your database connection details.

5. Start the server:
   ```bash
   npm start
   ```

6. Open your web browser and navigate to `http://localhost:3000` to view the application.

## Usage

- **Register/Login**: Users can register using a username and password or using their Google account.
- **Dashboard**: Upon logging in, users are redirected to their dashboard where they can view summary information.
- **Profile**: Users can view and edit their profile details, including uploading a profile picture.
- **Hackathons**: Users can add new hackathons they have participated in, providing details such as name, location, date, and project title.
- **Projects**: For each hackathon, users can add details about their projects, including description, technology stack, repository link, and demo link.
- **Achievements**: Users can list any awards or achievements they have received, associated with specific hackathons.
- **Logout**: Users can securely log out of their account.

## Screenshots

![Dashboard](/screenshots/dashboard.png)
*Dashboard view showcasing summary information.*

![Profile](/screenshots/profile.png)
*Profile view allowing users to manage their personal details.*

![Hackathons](/screenshots/hackathons.png)
*Hackathons view displaying a list of hackathons a user has participated in.*

## Contributing

Contributions are welcome! If you would like to contribute to this project, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the GPL License - see the [COPYING](COPYING) file for details.
