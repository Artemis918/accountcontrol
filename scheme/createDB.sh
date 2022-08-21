cat droptables_sql \
    createCategory.sql \
    createSubCategory.sql \
    createTemplate.sql \
    createPlan.sql \
    createAccountRecord.sql \
    createAssignment.sql | psql -U account -h localhost -p 5432 -d accounttest
