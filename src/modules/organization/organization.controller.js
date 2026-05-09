import * as OrganizationService from './organization.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';

export const createOrganization = asyncWrapper(async (req, res) => {
  const result = await OrganizationService.createOrganization(req.body);
  
  return sendSuccess(
    res, 
    { 
      success: true, 
      orgId: result.orgId, 
      reportId: result.reportId, 
      message: "Analysis queued" 
    }, 
    "Organization created and analysis queued", 
    202
  );
});

export const getOrganization = asyncWrapper(async (req, res) => {
  const organization = await OrganizationService.getOrganizationDetails(req.params.id);
  
  return sendSuccess(res, organization);
});
