from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


# ==========================
# 1. Company Profile
# ==========================
class CompanyProfile(db.Model):
    __tablename__ = "company_profile"
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(200), nullable=False)
    comp_password = db.Column(db.String(256), nullable=False)
    description = db.Column(db.String(200))  # 200 characters
    website = db.Column(db.String(200))

    # Relationship: one company → many job listings
    job_listings = db.relationship("JobListing", backref="company", lazy=True)


# ==========================
# 2. Student Authentication (Login / Registration)
# ==========================
class StudentAuth(db.Model):
    __tablename__ = "student_registeration"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(256), nullable=False)

    # One-to-one relationship with StudentProfile
    profile = db.relationship("StudentProfile", backref="auth", uselist=False)


# ==========================
# 3. Student Profile
# ==========================
class StudentProfile(db.Model):
    __tablename__ = "student_profile"
    id = db.Column(db.Integer, primary_key=True)

    # 🔑 Foreign Key linking profile → StudentAuth
    student_id = db.Column(db.Integer, db.ForeignKey("student_registeration.id"), unique=True, nullable=False)

    name = db.Column(db.String(100), nullable=False)
    college_roll = db.Column(db.String(50), nullable=False, unique=True)
    about = db.Column(db.Text)
    skillset = db.Column(db.String(300))
    resume = db.Column(db.String(200))
    github = db.Column(db.String(200))
    linkedin = db.Column(db.String(200))
    portfolio = db.Column(db.String(200))

    # Relationship: one student profile → many listings
    listings = db.relationship("StudentListing", backref="student", lazy=True)


# ==========================
# 4. Job Listing / Details
# ==========================
class JobListing(db.Model):
    __tablename__ = "job_listing"
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey("company_profile.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    job_type = db.Column(db.String(50))  # Internship / Project
    stipend = db.Column(db.String(100))
    requirements = db.Column(db.String(300))
    company_name = db.Column(db.String(200))


# ==========================
# 5. Student Listing
# ==========================
class StudentListing(db.Model):
    __tablename__ = "student_listing"
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("student_profile.id"), nullable=False)
    requirements = db.Column(db.String(300))
