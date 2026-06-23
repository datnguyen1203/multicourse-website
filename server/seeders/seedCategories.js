const Category = require('../models/Category');

const defaultCategories = [
    {
        name: 'Web Development',
        description: 'Learn web development including HTML, CSS, JavaScript, React, Node.js',
        status: true,
    },
    {
        name: 'Mobile Development',
        description: 'Learn mobile app development for iOS and Android',
        status: true,
    },
    {
        name: 'Data Science',
        description: 'Learn data science, machine learning, and data analysis',
        status: true,
    },
    {
        name: 'Design',
        description: 'Learn UI/UX design, graphic design, and web design',
        status: true,
    },
    {
        name: 'Business',
        description: 'Learn business management, entrepreneurship, and marketing',
        status: true,
    },
    {
        name: 'Programming',
        description: 'Learn programming fundamentals and advanced concepts',
        status: true,
    },
];

const seedCategories = async () => {
    try {
        const existingCategories = await Category.countDocuments();

        if (existingCategories === 0) {
            await Category.insertMany(defaultCategories);
            console.log('✓ Default categories created successfully');
        } else {
            console.log(`✓ Categories already exist (${existingCategories} categories found)`);
        }
    } catch (error) {
        console.error('✗ Error seeding categories:', error.message);
    }
};

module.exports = seedCategories;
