# STARTIN' - University Recruitment Hub

STARTIN' is a web platform designed to connect students from SRM University with companies and startups. It provides a centralized hub where students can create professional profiles and apply for opportunities, and companies can post job listings and discover emerging talent.

![STARTIN' Landing Page](https://i.imgur.com/your-image-url.png) ## ✨ Features

The application offers a tailored experience for its two main user types: students and companies.

### 🎓 For Students
* *Secure Authentication:* Students can register and log in to their own dedicated portal.
* *Detailed Profiles:* Create and manage a professional profile that includes an "About Me" section, a list of skills, and links to GitHub, LinkedIn, and a personal portfolio.
* *Resume Upload:* Easily upload and update a personal resume.
* *Job Discovery:* Browse and search for available internships and projects posted by companies.
* *Apply for Jobs:* Submit applications for desired positions with a single click.

### 🏢 For Companies
* *Company Profiles:* Register and manage a company profile, including a description and a link to the company website.
* *Post Job Listings:* Create and post new job opportunities, specifying the title, description, stipend, and necessary requirements.
* *View Applicants:* Access a dashboard to view the profiles of students who have applied for their job listings, complete with links to their resumes and professional profiles.

## 🛠 Tech Stack

This project is built with a modern and reliable set of technologies:

* *Backend:* *Python* with the *Flask* web framework.
* *Database:* *SQLAlchemy ORM* with a *SQLite* database.
* *Frontend:* *HTML, **CSS, and **JavaScript*.
* *Security:* Passwords are securely hashed using *Werkzeug*.

## 🚀 Setup and Installation

To run this project locally, follow these steps:

1.  *Clone the repository:*
    bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    

2.  *Create a virtual environment (recommended):*
    bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    

3.  *Install the dependencies:*
    bash
    pip install -r requirements.txt
    

4.  *Run the application:*
    bash
    python app.py
    
    The application will start, and it will automatically create the instance/STARTIN_.db database file on the first run.

## Usage

Once the application is running, open your web browser and navigate to http://127.0.0.1:5000/.

1.  From the landing page, select "SRM University" and then choose either the "Student" or "Company" role.
2.  You can then create a new account or log in if you already have one.
3.  Explore the dashboard and features tailored to your selected role.
