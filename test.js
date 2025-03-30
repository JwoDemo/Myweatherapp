// Weather App Test Suite - Automated tests for weather application functionality
// Last updated: March 30, 2024
// Test cases for the weather application

const fetch = require('node-fetch');

// Helper function to check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Helper function to log test results with detailed output
function logTest(message, passed, details = '') {
    const result = passed ? 'PASS' : 'FAIL';
    console.log(`\n${message}: ${result}`);
    if (details) {
        console.log(`Details: ${details}`);
    }
}

// Test Case 1: Valid ZIP code format
function testValidZipCodeFormat() {
    console.log('\n=== Test Case 1: Valid ZIP code format ===');
    
    const validZips = ['12345', '54321', '00000', '99999'];
    const invalidZips = ['1234', '123456', 'abcde', '1234a', '1234!'];
    
    console.log('\nTesting valid ZIP codes:');
    validZips.forEach(zip => {
        const isValid = /^\d{5}$/.test(zip);
        logTest(`ZIP ${zip}`, isValid, `Expected: 5 digits, Got: ${zip.length} digits`);
    });
    
    console.log('\nTesting invalid ZIP codes:');
    invalidZips.forEach(zip => {
        const isValid = /^\d{5}$/.test(zip);
        logTest(`ZIP ${zip}`, !isValid, `Expected: Invalid, Got: ${isValid ? 'Valid' : 'Invalid'}`);
    });

    // Special test for '00000' - valid format but invalid ZIP
    console.log('\nTesting special case ZIP 00000:');
    const isFormatValid = /^\d{5}$/.test('00000');
    logTest('ZIP 00000 format', isFormatValid, 'Format is valid (5 digits) but ZIP is invalid');
}

// Test Case 2: API Response Handling
async function testAPIResponse() {
    console.log('\n=== Test Case 2: API Response Handling ===');
    
    // Test with a valid ZIP code (New York)
    console.log('\nTesting valid ZIP code (10001):');
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=10001,us&appid=235a790f84c436789bb93aa5f39b24dd&units=imperial`);
        const data = await response.json();
        
        if (response.ok) {
            logTest('API Response Status', true, `Status: ${response.status}`);
            const hasRequiredFields = data.name && data.main && data.weather && data.wind;
            logTest('Required Fields Present', hasRequiredFields, 
                `Fields found: ${Object.keys(data).join(', ')}`);
        }
    } catch (error) {
        logTest('API Response Status', false, `Error: ${error.message}`);
    }
    
    // Test with an invalid ZIP code (00000)
    console.log('\nTesting invalid ZIP code (00000):');
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=00000,us&appid=235a790f84c436789bb93aa5f39b24dd&units=imperial`);
        const data = await response.json();
        
        logTest('Invalid ZIP Response (00000)', data.cod === '404', 
            `Expected: 404 (Not Found), Got: ${data.cod}`);
        if (data.cod === '404') {
            logTest('Error Message', true, `Message: ${data.message}`);
        }
    } catch (error) {
        logTest('Invalid ZIP Response (00000)', false, `Error: ${error.message}`);
    }
}

// Test Case 3: Data Sanitization
function testDataSanitization() {
    console.log('\n=== Test Case 3: Data Sanitization ===');
    
    const testCases = [
        { input: '<script>alert("xss")</script>', expected: 'scriptalert("xss")/script' },
        { input: 'New York', expected: 'New York' },
        { input: '12345', expected: '12345' }
    ];
    
    testCases.forEach(test => {
        const sanitized = test.input.replace(/[<>]/g, '');
        logTest(`Sanitize "${test.input}"`, sanitized === test.expected,
            `Expected: "${test.expected}", Got: "${sanitized}"`);
    });
}

// Test Case 4: Temperature Conversion
function testTemperatureConversion() {
    console.log('\n=== Test Case 4: Temperature Conversion ===');
    
    const testCases = [
        { celsius: 0, expected: 32 },
        { celsius: 100, expected: 212 },
        { celsius: -40, expected: -40 }
    ];
    
    testCases.forEach(test => {
        const fahrenheit = (test.celsius * 9/5) + 32;
        const passed = Math.abs(fahrenheit - test.expected) < 0.1;
        logTest(`${test.celsius}°C to Fahrenheit`, passed,
            `Expected: ${test.expected}°F, Got: ${fahrenheit.toFixed(1)}°F`);
    });
}

// Run all tests
async function runAllTests() {
    console.log('=== Starting Weather App Tests ===\n');
    
    testValidZipCodeFormat();
    await testAPIResponse();
    testDataSanitization();
    testTemperatureConversion();
    
    console.log('\n=== All tests completed! ===\n');
}

// Run the tests immediately
runAllTests().catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
}); 