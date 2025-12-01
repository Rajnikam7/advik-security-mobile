// Debug script to test admin service endpoints
// This simulates what the mobile app does

const testAdminService = async () => {
  const baseURL = 'http://10.0.2.2:5001/api/security';
  
  console.log('🔍 Testing Admin Service Endpoints');
  console.log('📍 Base URL:', baseURL);
  
  try {
    // Step 1: Login as admin
    console.log('\n1️⃣ Testing admin login...');
    const loginResponse = await fetch(`${baseURL}/auth/test-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: '8888888888',
        otp: '888888'
      })
    });
    
    if (!loginResponse.ok) {
      const error = await loginResponse.json();
      console.error('❌ Admin login failed:', error);
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Admin login successful');
    console.log('👤 User role:', loginData.user.role);
    
    const token = loginData.token;
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Step 2: Test getDashboardStats
    console.log('\n2️⃣ Testing getDashboardStats...');
    const statsResponse = await fetch(`${baseURL}/admin/dashboard/stats`, {
      method: 'GET',
      headers
    });
    
    console.log('📊 Stats Response Status:', statsResponse.status);
    
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ Dashboard stats retrieved successfully');
      console.log('📈 Users:', statsData.data.users);
      console.log('📋 Complaints:', statsData.data.complaints);
    } else {
      const error = await statsResponse.json();
      console.error('❌ Dashboard stats failed:', statsResponse.status, error);
    }
    
    // Step 3: Test getAllUsers
    console.log('\n3️⃣ Testing getAllUsers...');
    const usersResponse = await fetch(`${baseURL}/admin/users`, {
      method: 'GET',
      headers
    });
    
    console.log('👥 Users Response Status:', usersResponse.status);
    
    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      console.log('✅ Users retrieved successfully');
      console.log('📊 Total users:', usersData.count);
      console.log('👤 First user:', usersData.data[0]?.name || 'No users');
    } else {
      const error = await usersResponse.json();
      console.error('❌ Get users failed:', usersResponse.status, error);
    }
    
    // Step 4: Test getAllUsers with search
    console.log('\n4️⃣ Testing getAllUsers with search...');
    const searchResponse = await fetch(`${baseURL}/admin/users?search=admin`, {
      method: 'GET',
      headers
    });
    
    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      console.log('✅ User search successful');
      console.log('🔍 Search results:', searchData.count);
    } else {
      const error = await searchResponse.json();
      console.error('❌ User search failed:', searchResponse.status, error);
    }
    
    // Step 5: Test with customer token (should fail)
    console.log('\n5️⃣ Testing customer access (should fail)...');
    const customerLoginResponse = await fetch(`${baseURL}/auth/test-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: '9999999999',
        otp: '999999'
      })
    });
    
    if (customerLoginResponse.ok) {
      const customerData = await customerLoginResponse.json();
      const customerHeaders = {
        'Authorization': `Bearer ${customerData.token}`,
        'Content-Type': 'application/json'
      };
      
      const customerStatsResponse = await fetch(`${baseURL}/admin/dashboard/stats`, {
        method: 'GET',
        headers: customerHeaders
      });
      
      if (customerStatsResponse.status === 403) {
        console.log('✅ Customer correctly denied access (403 Forbidden)');
      } else {
        console.error('❌ Customer should not have access to admin endpoints');
        console.log('🚨 Response status:', customerStatsResponse.status);
      }
    }
    
    console.log('\n🎉 Admin service testing completed!');
    
  } catch (error) {
    console.error('💥 Test failed with error:', error.message);
    console.error('🔧 Check if:');
    console.error('   - Backend server is running on port 5001');
    console.error('   - Admin routes are properly registered');
    console.error('   - Database is connected');
  }
};

// Run the test
testAdminService();