from Models import db, JobListing, CompanyProfile
from app import app

with app.app_context():
    jobs = JobListing.query.all()
    for job in jobs:
        if not job.company_name and job.company_id:
            company = CompanyProfile.query.get(job.company_id)
            if company:
                job.company_name = company.company_name
    db.session.commit()
    print("Company names updated for all jobs.")
