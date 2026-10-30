import db from '../db.js';

const FACULTY_SELECT = `
    SELECT
        f.id,
        f.first_name,
        f.last_name,
        f.office,
        f.phone,
        f.email,
        f.title,
        f.gender,
        f.slug,
        d.name AS department_name,
        d.code AS department_code
    FROM faculty f
    JOIN departments d ON f.department_id = d.id
`;

const formatFaculty = (row) => ({
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    name: `${row.first_name} ${row.last_name}`,
    office: row.office,
    phone: row.phone,
    email: row.email,
    title: row.title,
    gender: row.gender,
    slug: row.slug,
    department: row.department_name,
    departmentCode: row.department_code
});

const getOrderByClause = (sortBy = 'name') => {
    switch (sortBy) {
        case 'department':
            return 'd.name, f.last_name, f.first_name';

        case 'title':
            return 'f.title, f.last_name, f.first_name';

        case 'name':
        default:
            // Invalid values also default to name
            return 'f.last_name, f.first_name';
    }
};

const getFaculty = async (identifier, identifierType = 'id') => {
    const whereClause =
        identifierType === 'slug' ? 'f.slug = $1' : 'f.id = $1';

    const query = `
        ${FACULTY_SELECT}
        WHERE ${whereClause}
    `;

    const result = await db.query(query, [identifier]);

    if (result.rows.length === 0) {
        return null;
    }

    return formatFaculty(result.rows[0]);
};



const getFacultyById = (facultyId) => {
    return getFaculty(facultyId, 'id');
};

const getFacultyBySlug = (facultySlug) => {
    return getFaculty(facultySlug, 'slug');
};

const getSortedFaculty = async (sortBy = 'name') => {
    const orderByClause = getOrderByClause(sortBy);

    const query = `
        ${FACULTY_SELECT}
        ORDER BY ${orderByClause}
    `;

    const result = await db.query(query);

    return result.rows.map(formatFaculty);
};

const getFacultyByDepartment = async (
    departmentId,
    sortBy = 'name'
) => {
    const orderByClause = getOrderByClause(sortBy);

    const query = `
        ${FACULTY_SELECT}
        WHERE f.department_id = $1
        ORDER BY ${orderByClause}
    `;

    const result = await db.query(query, [departmentId]);

    return result.rows.map(formatFaculty);
};

export {
    getFacultyById,
    getFacultyBySlug,
    getSortedFaculty,
    getFacultyByDepartment
};