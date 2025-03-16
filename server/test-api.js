import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'http://localhost:5000/api';
let authToken = '';

// Test user registration
async function testRegisterUser() {
  try {
    console.log('\n🔹 Testing user registration...');
    
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser2',
        email: 'testuser2@example.com',
        password: 'Password123',
      }),
    });
    
    const data = await response.json();
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('✅ User registration successful');
      authToken = data.token;
      return data;
    } else {
      console.log('❌ User registration failed:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error during registration:', error);
    return null;
  }
}

// Test user login
async function testLogin() {
  try {
    console.log('\n🔹 Testing user login...');
    
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123',
      }),
    });
    
    const data = await response.json();
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('✅ Login successful');
      authToken = data.token;
      return data;
    } else {
      console.log('❌ Login failed:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error during login:', error);
    return null;
  }
}

// Test save resume
async function testSaveResume() {
  if (!authToken) {
    console.log('❌ Cannot save resume: No auth token available');
    return null;
  }
  
  try {
    console.log('\n🔹 Testing save resume...');
    
    const resumeData = {
      resumeData: {
        personalInfo: {
          name: 'Test User',
          title: 'Software Developer',
          email: 'testuser@example.com',
          phone: '123-456-7890',
          location: 'Test City, TS',
          summary: 'Experienced developer with a passion for creating amazing applications.'
        },
        experience: [
          {
            company: 'Test Corp',
            position: 'Senior Developer',
            duration: '2020 - Present',
            description: 'Leading development of innovative software solutions.'
          }
        ],
        education: [
          {
            institution: 'Test University',
            degree: 'BS Computer Science',
            duration: '2015 - 2019',
            description: 'Focus on software engineering and data structures.'
          }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB']
      },
      styleOptions: {
        layout: 'modern',
        primaryColor: '#0ea5e9',
        fontFamily: 'sans',
        fontSize: 'base',
      }
    };
    
    const response = await fetch(`${API_URL}/resumes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(resumeData),
    });
    
    const data = await response.json();
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('✅ Resume saved successfully');
      return data;
    } else {
      console.log('❌ Resume save failed:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error saving resume:', error);
    return null;
  }
}

// Test get resume
async function testGetResume() {
  if (!authToken) {
    console.log('❌ Cannot get resume: No auth token available');
    return null;
  }
  
  try {
    console.log('\n🔹 Testing get resume...');
    
    const response = await fetch(`${API_URL}/resumes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
    });
    
    const data = await response.json();
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('✅ Resume fetched successfully');
      return data;
    } else {
      console.log('❌ Resume fetch failed:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error fetching resume:', error);
    return null;
  }
}

// Test update resume (PATCH method)
async function testUpdateResume() {
  if (!authToken) {
    console.log('❌ Cannot update resume: No auth token available');
    return null;
  }
  
  try {
    console.log('\n🔹 Testing update resume (PATCH)...');
    
    const resumeData = {
      resumeData: {
        personalInfo: {
          name: 'Test User Updated',
          title: 'Senior Software Developer',
          email: 'testuser@example.com',
          phone: '123-456-7890',
          location: 'Test City, TS',
          summary: 'Experienced developer with a passion for creating amazing applications and services.'
        },
        experience: [
          {
            company: 'Test Corp',
            position: 'Senior Developer',
            duration: '2020 - Present',
            description: 'Leading development of innovative software solutions and mentoring junior developers.'
          }
        ],
        education: [
          {
            institution: 'Test University',
            degree: 'BS Computer Science',
            duration: '2015 - 2019',
            description: 'Focus on software engineering and data structures.'
          }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'TypeScript']
      },
      styleOptions: {
        layout: 'professional',
        primaryColor: '#2563eb',
        fontFamily: 'serif',
        fontSize: 'base',
      }
    };
    
    const response = await fetch(`${API_URL}/resumes`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(resumeData),
    });
    
    const data = await response.json();
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('✅ Resume updated successfully (PATCH)');
      return data;
    } else {
      console.log('❌ Resume update failed:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error updating resume:', error);
    return null;
  }
}

// Run the tests
async function runTests() {
  console.log('🚀 Starting API tests...');
  
  // Try to log in first - if that fails, try registration
  const loginResult = await testLogin();
  
  if (!loginResult) {
    console.log('\n🔹 Login failed, trying registration...');
    await testRegisterUser();
  }
  
  // Test resume operations only if we have authentication
  if (authToken) {
    await testSaveResume();
    await testGetResume();
    await testUpdateResume();
  }
  
  console.log('\n✨ API tests completed');
}

runTests(); 