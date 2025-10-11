// test.js
async function testDatabase() {
    console.log('Testing database connection...');
    
    // Test courses
    const courses = await courseDB.getAllCourses();
    console.log('Courses:', courses);
    
    // Test users
    const users = await courseDB.getAllUsers();
    console.log('Users:', users);
    
    // Test enrollments
    const enrollments = await courseDB.getAllEnrollments();
    console.log('Enrollments:', enrollments);
}

testDatabase();