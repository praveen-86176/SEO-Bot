import * as OrganizationModel from './organization.model.js';
import { seoQueue } from '../../config/queue.js';
import prisma from '../../config/database.js';
import AppError from '../../utils/appError.js';
import logger from '../../utils/logger.js';

export const createOrganization = async (orgData) => {
  const { organization, report } = await OrganizationModel.createOrganizationWithReport(orgData);

  // Push job to BullMQ
  try {
    const job = await seoQueue.add('seo-analysis', {
      orgId: organization.id,
      reportId: report.id,
    });
    
    // Store jobId in SeoReport for progress tracking
    await prisma.seoReport.update({
      where: { id: report.id },
      data: { jobId: job.id }
    });

    logger.info(`Queued SEO analysis for Org: ${organization.id}, Report: ${report.id} | JobId: ${job.id}`);
  } catch (error) {
    logger.error('Failed to queue SEO analysis job:', error);
  }

  return { 
    orgId: organization.id, 
    reportId: report.id 
  };
};

export const getOrganizationDetails = async (id) => {
  const organization = await OrganizationModel.getOrganizationById(id);

  if (!organization) {
    throw new AppError('Organization not found', 404);
  }

  return organization;
};
