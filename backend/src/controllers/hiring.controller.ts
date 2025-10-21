import { Request, Response } from 'express';
import { JobPosting } from '../models/JobPosting.model';
import { JobApplication } from '../models/JobApplication.model';
import { ActivityLog } from '../models/ActivityLog.model';
import { sendEmail } from '../utils/emailService';

// Job Posting Management
export const getJobPostings = async (req: Request, res: Response) => {
  try {
    const { isActive, department, experienceLevel } = req.query;
    
    let query = {};
    if (isActive !== undefined) {
      query = { ...query, isActive: isActive === 'true' };
    }
    if (department) {
      query = { ...query, department: department as string };
    }
    if (experienceLevel) {
      query = { ...query, experienceLevel: experienceLevel as string };
    }

    const jobPostings = await JobPosting.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: jobPostings
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job postings',
      error: error.message
    });
  }
};

export const createJobPosting = async (req: Request, res: Response) => {
  try {
    const {
      title,
      department,
      location,
      employmentType,
      experienceLevel,
      description,
      requirements,
      responsibilities,
      benefits,
      salaryRange,
      applicationDeadline
    } = req.body;

    const jobPosting = await JobPosting.create({
      title,
      department,
      location,
      employmentType,
      experienceLevel,
      description,
      requirements: Array.isArray(requirements) ? requirements : [],
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
      benefits: Array.isArray(benefits) ? benefits : [],
      salaryRange,
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined,
      createdBy: req.user?._id
    });

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      action: 'CREATE',
      entityType: 'JOB',
      entityId: jobPosting._id,
      description: `Created job posting: ${jobPosting.title}`,
      metadata: { department: jobPosting.department, location: jobPosting.location }
    });

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      data: jobPosting
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create job posting',
      error: error.message
    });
  }
};

export const updateJobPosting = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const jobPosting = await JobPosting.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!jobPosting) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found'
      });
    }

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      action: 'UPDATE',
      entityType: 'JOB',
      entityId: jobPosting._id,
      description: `Updated job posting: ${jobPosting.title}`,
      metadata: { changes: Object.keys(updateData) }
    });

    res.status(200).json({
      success: true,
      message: 'Job posting updated successfully',
      data: jobPosting
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update job posting',
      error: error.message
    });
  }
};

export const deleteJobPosting = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const jobPosting = await JobPosting.findByIdAndDelete(id);
    if (!jobPosting) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found'
      });
    }

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      action: 'DELETE',
      entityType: 'JOB',
      entityId: jobPosting._id,
      description: `Deleted job posting: ${jobPosting.title}`,
      metadata: { deletedJob: jobPosting.title }
    });

    res.status(200).json({
      success: true,
      message: 'Job posting deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete job posting',
      error: error.message
    });
  }
};

// Job Application Management
export const getJobApplications = async (req: Request, res: Response) => {
  try {
    const { jobPostingId, status, limit = 50, page = 1 } = req.query;
    
    let query = {};
    if (jobPostingId) {
      query = { jobPostingId: jobPostingId as string };
    }
    if (status) {
      query = { ...query, status: status as string };
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const applications = await JobApplication.find(query)
      .populate('jobPostingId', 'title department')
      .populate('reviewedBy', 'name email')
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await JobApplication.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        applications,
        pagination: {
          current: Number(page),
          total: Math.ceil(total / Number(limit)),
          count: applications.length,
          totalCount: total
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job applications',
      error: error.message
    });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const application = await JobApplication.findByIdAndUpdate(
      id,
      {
        status,
        notes,
        reviewedAt: new Date(),
        reviewedBy: req.user?._id
      },
      { new: true, runValidators: true }
    ).populate('jobPostingId', 'title department')
     .populate('reviewedBy', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Send email notification to applicant
    try {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Application Status Update</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2c3e50; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 30px; background-color: #fff; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px; }
            .status { padding: 15px; border-radius: 5px; margin: 20px 0; }
            .status.shortlisted { background-color: #d4edda; border-left: 4px solid #28a745; }
            .status.rejected { background-color: #f8d7da; border-left: 4px solid #dc3545; }
            .status.hired { background-color: #cce5ff; border-left: 4px solid #007bff; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Application Status Update</h2>
              <p>Vikram Design Studio</p>
            </div>
            <div class="content">
              <p>Dear ${application.applicantName},</p>
              <p>We are writing to inform you about the status of your application for the <strong>${application.jobPostingId.title}</strong> position.</p>
              
              <div class="status ${status.toLowerCase()}">
                <h3>Status: ${status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}</h3>
                ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
              </div>
              
              <p>Thank you for your interest in joining our team.</p>
              <p>Best regards,<br><strong>The VDS Team</strong></p>
            </div>
          </div>
        </body>
        </html>
      `;

      await sendEmail({
        to: application.applicantEmail,
        subject: `Application Status Update - ${application.jobPostingId.title}`,
        html: emailHtml,
      });
    } catch (emailError) {
      console.warn('Failed to send status update email:', emailError);
    }

    // Log activity
    await ActivityLog.create({
      userId: req.user?._id,
      action: 'UPDATE',
      entityType: 'APPLICATION',
      entityId: application._id,
      description: `Updated application status to ${status} for ${application.applicantName}`,
      metadata: { 
        applicantEmail: application.applicantEmail,
        jobTitle: application.jobPostingId.title,
        status 
      }
    });

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update application status',
      error: error.message
    });
  }
};

// Public job application submission
export const submitJobApplication = async (req: Request, res: Response) => {
  try {
    const {
      jobPostingId,
      applicantName,
      applicantEmail,
      applicantPhone,
      resumeUrl,
      coverLetter
    } = req.body;

    // Validate required fields
    if (!jobPostingId || !applicantName || !applicantEmail || !applicantPhone || !resumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Check if job posting exists and is active
    const jobPosting = await JobPosting.findById(jobPostingId);
    if (!jobPosting || !jobPosting.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found or no longer active'
      });
    }

    // Check application deadline
    if (jobPosting.applicationDeadline && new Date() > jobPosting.applicationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed'
      });
    }

    const application = await JobApplication.create({
      jobPostingId,
      applicantName,
      applicantEmail,
      applicantPhone,
      resumeUrl,
      coverLetter
    });

    // Send confirmation email to applicant
    try {
      const confirmationHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Application Received</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2c3e50; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 30px; background-color: #fff; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Application Received</h2>
              <p>Vikram Design Studio</p>
            </div>
            <div class="content">
              <p>Dear ${applicantName},</p>
              <p>Thank you for your interest in the <strong>${jobPosting.title}</strong> position at Vikram Design Studio.</p>
              <p>We have received your application and will review it carefully. We will get back to you within 5-7 business days.</p>
              <p>Best regards,<br><strong>The VDS Team</strong></p>
            </div>
          </div>
        </body>
        </html>
      `;

      await sendEmail({
        to: applicantEmail,
        subject: `Application Received - ${jobPosting.title}`,
        html: confirmationHtml,
      });
    } catch (emailError) {
      console.warn('Failed to send confirmation email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        id: application._id,
        appliedAt: application.appliedAt
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
};
