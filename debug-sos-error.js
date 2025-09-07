// Debug script for SOS 500 error
// Run this in browser console to test the API

const testSOSAPI = async () => {
  console.log('🔍 Testing SOS API...');
  
  // Test 1: Check if backend is running
  try {
    const healthResponse = await fetch('http://localhost:3001/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Backend Health:', healthData);
  } catch (error) {
    console.error('❌ Backend not running:', error.message);
    return;
  }
  
  // Test 2: Test SOS endpoint with minimal data
  try {
    const testSOS = {
      user_id: 'test-user-123',
      method: 'button_press'
    };
    
    console.log('📤 Sending SOS test:', testSOS);
    
    const response = await fetch('http://localhost:3001/api/sos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testSOS)
    });
    
    const data = await response.json();
    console.log('📥 SOS Response:', {
      status: response.status,
      statusText: response.statusText,
      data: data
    });
    
    if (response.ok) {
      console.log('✅ SOS API working correctly');
    } else {
      console.error('❌ SOS API error:', data);
    }
    
  } catch (error) {
    console.error('❌ SOS API test failed:', error);
  }
  
  // Test 3: Test with location data
  try {
    const testSOSWithLocation = {
      user_id: 'test-user-456',
      method: 'button_press',
      latitude: 40.7128,
      longitude: -74.0060
    };
    
    console.log('📤 Sending SOS with location:', testSOSWithLocation);
    
    const response = await fetch('http://localhost:3001/api/sos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testSOSWithLocation)
    });
    
    const data = await response.json();
    console.log('📥 SOS with Location Response:', {
      status: response.status,
      statusText: response.statusText,
      data: data
    });
    
  } catch (error) {
    console.error('❌ SOS with location test failed:', error);
  }
};

// Auto-run if in browser
if (typeof window !== 'undefined') {
  testSOSAPI();
}

// Export for manual use
window.testSOSAPI = testSOSAPI;
