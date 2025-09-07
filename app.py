from flask import Flask
from flask import render_template
from flask import request
from Models import db, CompanyProfile, StudentProfile, JobListing, StudentListing
from flask import jsonify
app=Flask(__name__,template_folder = 'templates',static_folder='static')

#databse setup
app.config["SECRET_KEY"] = "YOUR-SECRET-KEY"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///STARTIN_.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

#link database with Flask app
db.init_app(app)

@app.route('/STARTUP',methods = ["POST","GET"])
def index():
    if request.method == "GET":
        # Fetch all job listings
        job_listings = JobListing.query.all()
        # Fetch all students
        students = StudentProfile.query.all()
        return render_template('index_startup.html', jobs=job_listings, students=students)
    #handles job_posting
    elif request.method == "POST":
        print("in db")
        title_ = request.form['jobType']
        stipend_ = request.form['stipend']
        describe = request.form['description']
        requirements_ = request.form['requirements']
        jobtype=request.form['jobtype']

        job = JobListing(
            title = title_,
            description = describe,
            stipend = stipend_,
            requirements = requirements_,
            job_type = jobtype
        )
        db.session.add(job)
        db.session.commit()
        print(job.title)
        return render_template('index_startup.html')

@app.route('/STUDENT')
def index1():
    job_listing = JobListing.query.all()
    return render_template('index_student.html',jobs=job_listing)



@app.route('/api/jobs')
def api_jobs():
    jobs = JobListing.query.all()
    jobs_data = [
        {
            "id": job.id,
            "title": job.title,
            "description": job.description,
            "stipend": job.stipend,
            "requirements": job.requirements,
            "job_type": job.job_type
        }
        for job in jobs
    ]
    return jsonify(jobs_data)


@app.route('/static/profile_student.html',methods = ["POST","GET"])
def profile():
    if request.method == "GET":
        return render_template('profile_student.html')
    elif request.method == "POST":
        name_=request.form['studentName']
        rollnumber_=request.form['rollNumber']
        aboutme_=request.form['aboutMe']
        skillset_=request.form['skillset']
        github_=request.form['github']
        linkedin_=request.form['linkedin']
        portfolio_=request.form['portfolio']

        StudentProfile_ = StudentProfile(
            name = name_,
            college_roll = rollnumber_,
            about = aboutme_,
            skillset = skillset_,
            github = github_,
            linkedin = linkedin_,
            portfolio = portfolio_
        )

        db.session.add(StudentProfile_)
        db.session.commit()
    return render_template('index_student.html')


@app.route('/login')
def login():
    return render_template('index_login.html')

if __name__== "__main__":
    with app.app_context():
        db.create_all()
        print("database created successfully")
    app.run(debug = True )
