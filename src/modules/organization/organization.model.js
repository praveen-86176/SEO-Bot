import prisma from '../../config/database.js';

export const createOrganizationWithReport = async (orgData) => {
  return await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: orgData,
    });

    const report = await tx.seoReport.create({
      data: {
        org_id: organization.id,
        status: 'PENDING',
      },
    });

    return { organization, report };
  });
};

export const getOrganizationById = async (id) => {
  return await prisma.organization.findUnique({
    where: { id },
    include: {
      reports: {
        orderBy: { created_at: 'desc' },
        take: 1,
        select: {
          id: true,
          status: true,
          created_at: true,
        },
      },
    },
  });
};
